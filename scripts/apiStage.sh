#!/usr/bin/env bash
#
#
# Quick check to see if a container is running
#
checkContainerRunning()
{
  local CHECKONE=$1
  local COUNT=1
  local DURATION=10
  local DELAY=0.1

  printf "Check container running..."

  while [ $COUNT -le $DURATION ]; do
    sleep $DELAY
    (( COUNT++ ))
    if [ -z "$($PODMAN ps | grep $CHECKONE)" ]; then
      break
    fi
  done

  if [ ! -z "$($PODMAN ps | grep $CHECKONE)" ]; then
    printf "${GREEN}Container SUCCESS"
    printf "\n\n${NOCOLOR}"
  else
    printf "${RED}Container ERROR"
    printf "\n\n  Error: ${RED}Check container \"${CHECKONE}\""
    printf "${NOCOLOR}\n"
  fi
}
#
#
# Clean container tooling
#
cleanApi()
{
  echo "Cleaning everything, \$PODMAN and data..."
  printf "${RED}\n"
  $PODMAN system prune -f
  printf "${GREEN}$PODMAN cleaning success.${NOCOLOR}\n"
}
#
#
# Stop all QPC containers
#
stopApi()
{
  $PODMAN stop -t 0 $($PODMAN ps --filter name="qpc*")
  $PODMAN network rm -f -t 0 qpc-stage-network
}
#
#
# Run stage/dev setup, used for local development against the latest API, partially working login
#
stageApi()
{
  local HOST=$1
  local PORT=$2
  local PASSWORD=$3
  local NAME=$4
  local CONTAINER=$5

  $PODMAN stop -t 0 $NAME
  $PODMAN rm $NAME
  $PODMAN pull $CONTAINER

  $PODMAN stop -t 0 qpc-redis
  $PODMAN rm qpc-redis
  $PODMAN pull redis:6-alpine

  $PODMAN network rm -f -t 0 qpc-stage-network
  $PODMAN network create qpc-stage-network

  mkdir -p "${HOME}/.local/share/discovery/log"
  mkdir -p "${HOME}/.local/share/discovery/data"
  mkdir -p "${HOME}/.local/share/discovery/sshkeys"

  if [ -z "$($PODMAN ps | grep $NAME)" ]; then
    printf "\n"
    echo "Starting API, this could take a minute..."
    local MOUNT_ARGS=$([[ "$OSTYPE" == "darwin"* ]] && echo "" || echo ":z")

    $PODMAN run -itd --rm \
      --network qpc-stage-network \
      -p 6379:6379 \
      --name qpc-redis \
      redis:6-alpine

    $PODMAN run -itd --rm \
      --network qpc-stage-network \
      -e QUIPUCORDS_SERVER_PASSWORD=$PASSWORD \
      -e QUIPUCORDS_DBMS=sqlite \
      -e REDIS_HOST=qpc-redis \
      -p $PORT:8000 \
      -v "${HOME}"/.local/share/discovery/log/:/var/log"$MOUNT_ARGS" \
      -v "${HOME}"/.local/share/discovery/data/:/var/data"$MOUNT_ARGS" \
      -v "${HOME}"/.local/share/discovery/sshkeys/:/sshkeys"$MOUNT_ARGS" \
      --tls-verify=false \
      --name $NAME \
      $CONTAINER
  fi

  checkContainerRunning $NAME

  if [ ! -z "$($PODMAN ps | grep $NAME)" ]; then
    echo "  Container: $($PODMAN ps | grep $NAME | cut -c 1-80)"
    echo "  QPC container running: http://${HOST}:${PORT}/"
    printf "  To stop: $ ${GREEN}$PODMAN stop ${NAME}${NOCOLOR}\n"
  fi

  exit 0
}
#
#
# main()
#
{
  RED="\e[31m"
  GREEN="\e[32m"
  NOCOLOR="\e[39m"

  HOST="127.0.0.1"
  PORT=8000
  PASSWORD="1_2_3_4_5_"
  CONTAINER="quay.io/quipucords/quipucords:latest"
  PODMAN=""

  while getopts p:t:w:c option;
    do
      case $option in
        p ) PORT=$OPTARG;;
        t ) TYPE="$OPTARG";;
        w ) PASSWORD="$OPTARG";;
      esac
  done

  if [ "$(command -v podman)" ]; then
    PODMAN="podman"
  fi

  if [ -z "$PODMAN" ]; then
    printf "${RED}Missing container tooling. Unable to set \$PODMAN. podman, is required.${NOCOLOR}\n"
    exit 1
  else
    printf "\nFound $PODMAN... ${GREEN}Using container tooling $PODMAN${NOCOLOR}\n"
  fi

  case $TYPE in
    clean )
      cleanApi;;
    stage )
      stageApi $HOST $PORT $PASSWORD "qpc-stage" $CONTAINER;;
    stopApi )
      stopApi;;
  esac
}

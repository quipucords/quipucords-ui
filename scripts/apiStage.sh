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
}
#
#
# Run stage/dev setup, used for local development against the latest API, partially working login
#
stageApi()
{
  local PORT=$1
  local PASSWORD=$2
  local NAME=$3
  local CONTAINER=$4

  $PODMAN stop -t 0 $NAME
  $PODMAN rm $NAME
  $PODMAN pull $CONTAINER

  mkdir -p "${HOME}/.local/share/discovery/log"
  mkdir -p "${HOME}/.local/share/discovery/data"
  mkdir -p "${HOME}/.local/share/discovery/sshkeys"

  if [ -z "$($PODMAN ps | grep $NAME)" ]; then
    printf "\n"
    echo "Starting API, this could take a minute..."
    $PODMAN run -itd --rm \
      -e QPC_SERVER_PASSWORD=$PASSWORD \
      -e QPC_DBMS=sqlite \
      -p $PORT:443 \
      -v "${HOME}"/.local/share/discovery/log/:/var/log \
      -v "${HOME}"/.local/share/discovery/data/:/var/data \
      -v "${HOME}"/.local/share/discovery/sshkeys/:/sshkeys \
      --tls-verify=false \
      --name $NAME \
      $CONTAINER
  fi

  checkContainerRunning $NAME

  if [ ! -z "$($PODMAN ps | grep $NAME)" ]; then
    echo "  Container: $($PODMAN ps | grep $NAME | cut -c 1-80)"
    echo "  QPC container running: https://localhost:${PORT}/"
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

  PORT=9443
  PASSWORD="1_2_3_4_5_"
  CONTAINER="quay.io/quipucords/quipucords:latest"
  PODMAN=""

  while getopts p:t:c option;
    do
      case $option in
        p ) PORT=$OPTARG;;
        t ) TYPE="$OPTARG";;
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
      stageApi $PORT $PASSWORD "qpc-stage" $CONTAINER;;
    stopApi )
      stopApi;;
  esac
}

#!/usr/bin/env bash
#
#
# Clone Quipucords, build for local development
#
gitApi()
{
  rm -rf -- $DATADIR
  mkdir -p $DATADIR
  (cd $DATADIR && git clone --depth=1 https://github.com/quipucords/quipucords.git)
  rm -rf $DATADIR_REPO/.git
}
#
#
# Run swagger documentation
#
runDocs()
{
  node "./scripts/swagger.js"
}
#
#
# Check if a container is running. Currently supporting the mockApi container
#
checkContainerRunning()
{
  local NAME=$1
  local CONTAINER=$2
  local FILE=$3
  local COUNT=1
  local DURATION=10
  local DELAY=0.1

  printf "Check container running..."

  while [ $COUNT -le $DURATION ]; do
    sleep $DELAY
    (( COUNT++ ))
    if [ -z "$(docker ps | grep $CONTAINER)" ]; then
      break
    fi
  done

  if [ ! -z "$(docker ps | grep $CONTAINER)" ] && [ ! -z "$(docker ps | grep $NAME)" ]; then
    printf "${GREEN}Container SUCCESS"
    printf "\n\n${NOCOLOR}"
  elif [ ! -z "$FILE" ]; then
    local HASH=$(git rev-list -1 --all --abbrev-commit $FILE)
    local COMMIT=$(git rev-list -1 --all --oneline $FILE)
    local BLAME=$(git blame $FILE | grep $HASH | sed 's/^/  /')
    local GITHUB="https://github.com/quipucords/quipucords/commit/$HASH"

    echo "Last Commit:\n\n  ${COMMIT}\n\nVisit:\n\n  ${GITHUB}\n\nAssigning Blame:\n\n${BLAME}"  > api-debug.txt

    printf "${RED}Container ERROR"
    printf "\n${RED}  Review the Swagger doc for errors."
    printf "\n${RED}  Last commit: ${COMMIT}"
    printf "\n${RED}  See api-debug.txt for details."
    printf "\n${RED}  Visit: ${GITHUB}"
    printf "${NOCOLOR}\n"
  else
    printf "${RED}Container ERROR"
    printf "\n\n  Error: ${RED}Check \"${NAME}\" with \"${CONTAINER}\""
    printf "${NOCOLOR}\n"
  fi
}
#
#
# Install & Run Quipucords API Mock Container
#
devApi()
{
  local CONTAINER="palo/swagger-api-mock"
  local NAME="qpc-dev"
  local PORT=$1
  local FILE=$2
  local UPDATE=$3

  docker stop -t 0 $NAME >/dev/null

  gitApi

  if [ -z "$(docker images -q $CONTAINER)" ] || [ "$UPDATE" = true ]; then
    echo "Setting up development Docker API container"
    docker pull $CONTAINER
  fi

  if [ -z "$(docker ps | grep $CONTAINER)" ] && [ "$UPDATE" = false ]; then
    echo "Starting development API..."
    docker run -d --rm -p $PORT:8000 -v "$FILE:/data/swagger.yaml" --name $NAME $CONTAINER >/dev/null
  fi

  if [ "$UPDATE" = false ]; then
    checkContainerRunning $NAME $CONTAINER $FILE
  fi

  if [ ! -z "$(docker ps | grep $CONTAINER)" ] && [ "$UPDATE" = false ]; then
    echo "  Container: $(docker ps | grep $CONTAINER | cut -c 1-80)"
    echo "  QPC Development API running: http://localhost:$PORT/"
    printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"

    runDocs
  fi
}
#
#
# Setup & start DB Container
#
startDB()
{
  local CONTAINER="postgres:9.6.10"
  local NAME="qpc-db"
  local DATA="$(pwd)/.container"
  local DATA_VOLUME="/var/lib/postgresql/data"
  local QE=$1

  docker stop -t 0 $NAME >/dev/null

  if [ -z "$(docker images -q $CONTAINER)" ]; then
    echo "Setting up QPC DB container"
    docker pull $CONTAINER

    if [ -d "$DATA" ]; then
      rm -rf $DATA/*
    fi
  fi

  if [ "$QE" = true ]; then
    docker run -d --rm -e POSTGRES_PASSWORD=password --name $NAME $CONTAINER >/dev/null
  else
    docker run -d --rm -v $DATA:$DATA_VOLUME -e POSTGRES_PASSWORD=password --name $NAME $CONTAINER >/dev/null
  fi

  checkContainerRunning $NAME $CONTAINER

  if [ ! -z "$(docker ps | grep $CONTAINER)" ]; then
    echo "  Container: $(docker ps | grep $CONTAINER | cut -c 1-80)"
    echo "  QPC DB running:"
    printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
  fi
}
#
#
#
# Install & Run Quipucords API Container
#
stageApi()
{
  local CONTAINER="qpc-stage"
  local NAME="qpc-stage"
  local DB_NAME="qpc-db"
  local BUILD_DIR="$(pwd)/build"
  local CLIENT_VOLUME="/app/quipucords/client"
  local TEMPLATE_CLIENT_VOLUME="/app/quipucords/quipucords/templates/client"
  local PORT=$1
  local UPDATE=$2

  docker stop -t 0 $NAME >/dev/null

  gitApi

  if [ -z "$(docker images -q $CONTAINER)" ] || [ "$UPDATE" = true ]; then
    echo "Setting up staging Docker API container"
    docker build -t $CONTAINER $DATADIR_REPO/.
  fi

  if [ "$UPDATE" = false ]; then
    if [ -z "$(docker ps | grep $CONTAINER)" ]; then
      startDB
      printf "\n"
      echo "Starting staging API..."
      docker run -d --rm -p $PORT:443 -v $BUILD_DIR:$CLIENT_VOLUME -v $BUILD_DIR:$TEMPLATE_CLIENT_VOLUME -e QPC_DBMS_HOST=$DB_NAME --link $DB_NAME:qpc-link --name $NAME $CONTAINER >/dev/null
    fi

    checkContainerRunning $NAME $CONTAINER

    if [ ! -z "$(docker ps | grep $CONTAINER)" ]; then
      echo "  Container: $(docker ps | grep $CONTAINER | cut -c 1-80)"
      echo "  QPC Stage API running: https://localhost:${PORT}/"
      echo "  Connected to local directory: $(basename $BUILD_DIR | cut -c 1-80)"
      printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
    fi
  fi
}
#
#
# Install & Run Quipucords API Container
#
prodApi()
{
  local CONTAINER="qpc-latest"
  local NAME="qpc"
  local DB_NAME="qpc-db"
  local PORT=$1
  local UPDATE=$2

  docker stop -t 0 $NAME >/dev/null

  gitApi

  if [ -z "$(docker images -q $CONTAINER)" ] || [ "$UPDATE" = true ]; then
    echo "Setting up QPC Production container"
    docker build -t $CONTAINER $DATADIR_REPO/.
  fi

  if [ "$UPDATE" = false ]; then
    if [ -z "$(docker ps | grep $CONTAINER)" ]; then
      startDB
      printf "\n"
      echo "Starting QPC production API..."
      docker run -d --rm -p $PORT:443 -e QPC_DBMS_HOST=$DB_NAME --link $DB_NAME:qpc-link --name $NAME $CONTAINER >/dev/null
    fi

    checkContainerRunning $NAME $CONTAINER

    if [ ! -z "$(docker ps | grep $CONTAINER)" ]; then
      echo "  Container: $(docker ps | grep $CONTAINER | cut -c 1-80)"
      echo "  QPC Production API running: https://localhost:${PORT}/"
      printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
    fi
  fi
}
#
#
# Install & Run Quipucords API Container
#
qeApi()
{
  local CONTAINER="qpc-qe"
  local NAME="qpc-qe"
  local DB_NAME="qpc-db"
  local PORT=$1

  docker stop -t 0 $NAME >/dev/null

  gitApi

  echo "Setting up QPC QE container"

  docker build -t $CONTAINER $DATADIR_REPO/.

  if [ -z "$(docker ps | grep $CONTAINER)" ]; then
    startDB true
    printf "\n"
    echo "Starting QE API..."
    docker run -d --rm -p $PORT:443 -e QPC_DBMS_HOST=$DB_NAME --link $DB_NAME:qpc-link --name $NAME $CONTAINER >/dev/null
  fi

  checkContainerRunning $NAME $CONTAINER

  if [ ! -z "$(docker ps | grep $CONTAINER)" ]; then
    echo "  Container: $(docker ps | grep $CONTAINER | cut -c 1-80)"
    echo "  QPC QE API running: https://localhost:${PORT}/"
    printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
  fi
}
#
#
# main()
#
{
  RED="\e[31m"
  GREEN="\e[32m"
  NOCOLOR="\e[39m"
  PORT=8080
  DATADIR="$(pwd)/.qpc"
  DATADIR_REPO="$(pwd)/.qpc/quipucords"
  FILE="$(pwd)/.qpc/quipucords/docs/swagger.yml"
  UPDATE=false
  CLEAN=false

  while getopts p:f:t:cu option;
    do
      case $option in
        p ) PORT=$OPTARG;;
        f ) FILE="$OPTARG";;
        t ) TYPE="$OPTARG";;
        c ) CLEAN=true;;
        u ) UPDATE=true;;
      esac
  done

  if [ -z "$(docker info | grep Containers)" ]; then
    exit 1
  fi

  if [ "$TYPE" != dev ] && [ "$CLEAN" = true ]; then
    echo "Cleaning Docker and data..."
    printf "${RED}\n"
    docker system prune -f
    printf "${GREEN}Docker cleaning success.${NOCOLOR}\n"
  fi

  case $TYPE in
    qe )
      qeApi $PORT;;
    prod )
      prodApi $PORT $UPDATE;;
    stage )
      stageApi $PORT $UPDATE;;
    dev )
      devApi $PORT "$FILE" $UPDATE;;
    * )
      gitApi
      runDocs;;
  esac

  echo ""
}

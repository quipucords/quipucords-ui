#!/usr/bin/env bash
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
    if [ -z "$(docker ps | grep $CHECKONE)" ]; then
      break
    fi
  done

  if [ ! -z "$(docker ps | grep $CHECKONE)" ]; then
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
# Clone Quipucords, build for local development
#
gitApi()
{
  local REPO=$QPC_REPO
  local QPCDIR=$DATADIR
  local QPCDIR_REPO=$DATADIR_REPO

  mkdir -p $QPCDIR
  rm -rf $QPCDIR/temp
  (cd $QPCDIR && git clone --depth=1 $REPO temp > /dev/null 2>&1)

  if [ $? -eq 0 ]; then
    printf "\n${GREEN}Cloning QPC...${NOCOLOR}\n"

    rm -rf $QPCDIR_REPO
    cp -R  $QPCDIR/temp $QPCDIR_REPO

    rm -rf $QPCDIR/temp
    rm -rf $QPCDIR_REPO/.git

  elif [ -d $QPCDIR_REPO ]; then
    printf "${GREEN}Unable to connect, using cached QPC...${NOCOLOR}\n"
  else
    printf "${RED}Build Error, cloning QPC, unable to setup Docker${NOCOLOR}\n"
    exit 1
  fi
}
#
#
# Confirm resources exist for build
#
checkBuildFilesExist()
{
  local REPO=$DATADIR_REPO
  local DIR_CLIENT=$DISTDIR_CLIENT
  local DIR_TEMPLATES=$DISTDIR_TEMPLATES

  if [ ! -d $REPO ] || [ ! -d $DIR_CLIENT ] || [ ! -d $DIR_TEMPLATES ]; then
    printf "\n\n${RED}Build error, missing directories...\n"
    [ ! -d $REPO ] && printf "${RED}  - $REPO\n"
    [ ! -d $DIR_CLIENT ] && printf "${RED}  - $DIR_CLIENT\n"
    [ ! -d $DIR_TEMPLATES ] && printf "${RED}  - $DIR_TEMPLATES\n"
    printf "${NOCOLOR}\n\n"

    exit 1
  fi
}
#
#
# Setup & start DB Container
#
startDB()
{
  local CONTAINER="quay.io/fedora/postgresql-12"
  local NAME=$1
  local DATA="$(pwd)/.container/${NAME}/postgres"
  local DATA_VOLUME="/var/lib/postgresql/data"
  local STORE_DATA=$2

  docker stop -t 0 $NAME >/dev/null

  if [ -z "$(docker images -q $CONTAINER)" ]; then
    echo "Setting up QPC DB container"
    docker pull $CONTAINER

    if [ -d "$DATA" ]; then
      rm -rf $DATA/*
    fi
  fi

  if [ "$STORE_DATA" = true ]; then
    EXTRA_ARGS="-v $DATA:$DATA_VOLUME"
  else
    EXTRA_ARGS=""
  fi

  docker run -d --rm $EXTRA_ARGS \
    -e POSTGRESQL_USER=$POSTGRESQL_USER \
    -e POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
    -e POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE \
    --name $NAME $CONTAINER >/dev/null

  checkContainerRunning $NAME

  if [ ! -z "$(docker ps | grep $NAME)" ]; then
    echo "  Container: $(docker ps | grep $NAME | cut -c 1-80)"
    echo "  QPC DB running:"
    printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
  fi
}
#
#
# Install & build Quipucords app
#
buildApp()
{
  local REPO=$DATADIR_REPO
  local REPO_QPC=$DATADIR_REPO_QPC
  local REPO_QPC_TEMPLATES=$DATADIR_REPO_QPC_TEMPLATES
  local DIR_CLIENT=$DISTDIR_CLIENT
  local DIR_TEMPLATES=$DISTDIR_TEMPLATES
  local CONTAINER=$1

  gitApi
  checkBuildFilesExist

  docker stop -t 0 $CONTAINER >/dev/null
  docker rmi -f $CONTAINER:latest

  echo "Setting up QPC container"

  cp -rf $DIR_TEMPLATES $REPO_QPC_TEMPLATES
  cp -rf $DIR_CLIENT $REPO_QPC
  docker build -t $CONTAINER $REPO/.
}
#
#
# Run a production setup, used for GUI against the latest API for confirmation
#
reviewApi()
{
  local NAME="qpc-review"
  local DB_NAME="qpc-db-review"
  local PORT=$1
  local IS_BUILT=$2
  local CONTAINER=$3

  if [ "$IS_BUILT" = true ]; then
    CONTAINER=$NAME
    buildApp $CONTAINER
  else
    docker stop -t 0 $NAME >/dev/null
  fi

  startDB $DB_NAME

  if [ -z "$(docker ps | grep $NAME)" ]; then
    printf "\n"
    echo "Starting API..."
    docker run -d --rm -p $PORT:443 -e QPC_DBMS_HOST=$DB_NAME --link $DB_NAME:qpc-link --name $NAME $CONTAINER >/dev/null
  fi

  checkContainerRunning $NAME

  if [ ! -z "$(docker ps | grep $NAME)" ]; then
    echo "  Container: $(docker ps | grep $NAME | cut -c 1-80)"
    echo "  QPC API running: https://127.0.0.1:${PORT}/"
    printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
  fi

  exit 0
}
#
#
# Run stage/dev setup, used for local development against the latest API, partially working login
#
stageApi()
{
  local NAME="qpc-stage"
  local DB_NAME="qpc-db-stage"
  local PORT=$1
  local UPDATE=$2
  local IS_BUILT=$3
  local CONTAINER=$4

  local BUILD_DIR="$(pwd)/build"
  local CLIENT_VOLUME="/app/quipucords/client"
  local TEMPLATE_CLIENT_VOLUME="/app/quipucords/quipucords/templates/client"

  local TEMPLATE_DIR="$(pwd)/templates/registration"
  local TEMPLATE_REGISTRATION_VOLUME="/app/quipucords/quipucords/templates/registration"

  local DIST_CLIENT_ASSETS="$(pwd)/dist/client/assets"
  local CLIENT_ASSETS_VOLUME="/app/quipucords/client/assets"

  if [ "$IS_BUILT" = true ]; then
    CONTAINER=$NAME
    buildApp $CONTAINER
  else
    docker stop -t 0 $NAME >/dev/null
    docker rm $NAME >/dev/null
    docker pull $CONTAINER
  fi

  if [ ! "$UPDATE" = true ]; then
    startDB $DB_NAME
    if [ -z "$(docker ps | grep $NAME)" ]; then
      printf "\n"
      echo "Starting API..."
      docker run -d --rm -p $PORT:443 \
        -v $BUILD_DIR:$CLIENT_VOLUME \
        -v $BUILD_DIR:$TEMPLATE_CLIENT_VOLUME \
        -v $TEMPLATE_DIR:$TEMPLATE_REGISTRATION_VOLUME \
        -e DJANGO_DEBUG=true \
        -e QPC_DBMS_DATABASE=$POSTGRESQL_DATABASE \
        -e QPC_DBMS_HOST=$DB_NAME \
        -e QPC_DBMS_PASSWORD=$POSTGRESQL_PASSWORD \
        -e QPC_DBMS_PORT=$POSTGRESQL_PORT \
        -e QPC_DBMS_USER=$POSTGRESQL_USER \
        --link $DB_NAME:qpc-link \
        --name $NAME $CONTAINER >/dev/null
    fi

    checkContainerRunning $NAME

    if [ ! -z "$(docker ps | grep $NAME)" ]; then
      echo "  Container: $(docker ps | grep $NAME | cut -c 1-80)"
      echo "  QPC API running: https://localhost:${PORT}/"
      printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
    fi

    exit 0
  fi
}
#
#
# Run dev setup, used for local development against mock data
#
devApi()
{
  local NAME="qpc-dev"
  local PORT=$1
  local FILE=$2
  local UPDATE=$3
  local CONTAINER=$4

  docker stop -t 0 $NAME >/dev/null

  if [ -z "$(docker images -q $CONTAINER)" ] || [ "$UPDATE" = true ]; then
    echo "Setting up development Docker API container"
    docker pull $CONTAINER
  fi

  if [ ! "$UPDATE" = true ]; then
    gitApi

    if [ -z "$(docker ps | grep $CONTAINER)" ]; then
      echo "Starting development API..."
      docker run -d --rm -p $PORT:8000 -v "$FILE:/data/swagger.yaml" --name $NAME $CONTAINER >/dev/null
    fi

    checkContainerRunning $NAME

    if [ ! -z "$(docker ps | grep $CONTAINER)" ]; then
      echo "  Container: $(docker ps | grep $CONTAINER | cut -c 1-80)"
      echo "  QPC Development API running: http://localhost:$PORT/"
      printf "  To stop: $ ${GREEN}docker stop ${NAME}${NOCOLOR}\n"
    fi

    exit 0
  fi
}
#
#
# Serve swagger spec
#
runSpecs()
{
  local GITREPO=$1

  if [ "$GITREPO" = true ]; then
    gitApi
  fi

  node "./scripts/swagger.js"
}
#
#
# Stop QPC containers
#
stopApi()
{
  docker stop $(docker ps --filter name="qpc*")
}
#
#
# main()
#
{
  RED="\e[31m"
  GREEN="\e[32m"
  NOCOLOR="\e[39m"

  PORT=5001
  FILE="$(pwd)/.qpc/quipucords/docs/swagger.yml"

  QPC_REPO="https://github.com/quipucords/quipucords.git"
  QPC_IMAGE_CONTAINER="quay.io/quipucords/quipucords:latest"
  MOCK_IMAGE_CONTAINER="palo/swagger-api-mock"
  DATADIR="$(pwd)/.qpc"
  DATADIR_REPO="$(pwd)/.qpc/quipucords"
  DATADIR_REPO_QPC="$(pwd)/.qpc/quipucords/quipucords"
  DATADIR_REPO_QPC_TEMPLATES="$(pwd)/.qpc/quipucords/quipucords/quipucords"

  DISTDIR_CLIENT="$(pwd)/dist/client"
  DISTDIR_TEMPLATES="$(pwd)/dist/templates"

  POSTGRESQL_USER="qpc"
  POSTGRESQL_PASSWORD="qpc"
  POSTGRESQL_DATABASE="qpc"
  POSTGRESQL_PORT="5432"

  BUILT=false
  UPDATE=false
  CLEAN=false

  while getopts p:f:t:cub option;
    do
      case $option in
        p ) PORT=$OPTARG;;
        f ) FILE="$OPTARG";;
        t ) TYPE="$OPTARG";;
        c ) CLEAN=true;;
        u ) UPDATE=true;;
        b ) BUILT=true;;
      esac
  done

  if [ -z "$(docker -v)" ]; then
    printf "\n${RED}Docker missing, confirm installation and running.${NOCOLOR}\n"
    exit 1
  fi

  if [ "$CLEAN" = true ]; then
    echo "Cleaning everything, Docker and data..."
    printf "${RED}\n"
    docker system prune -f
    printf "${GREEN}Docker cleaning success.${NOCOLOR}\n"
  fi

  case $TYPE in
    review )
      reviewApi $PORT $BUILT $QPC_IMAGE_CONTAINER;;
    stage )
      stageApi $PORT $UPDATE $BUILT $QPC_IMAGE_CONTAINER;;
    dev )
      devApi $PORT "$FILE" $UPDATE $MOCK_IMAGE_CONTAINER;;
    specs )
      runSpecs true;;
    gitApi )
      gitApi;;
    stopApi )
      stopApi;;
    update )
      devApi $PORT "$FILE" true
      stageApi $PORT true
      ;;
  esac

  echo ""
}

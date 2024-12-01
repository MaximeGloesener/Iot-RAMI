#!/bin/bash

docker_build(){
  echo "Building docker image..."
    docker build --no-cache -f $REPO_PATH/Dockerfile --build-arg VITE_APP_ENV="$VITE_APP_ENV" --build-arg VITE_APP_PORT_IN="$VITE_APP_PORT_IN" --build-arg VITE_APP_BACK_URL="$VITE_APP_BACK_URL" -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .
}

docker_build_tag(){
  echo "Building docker image..."
    docker build --no-cache -f $REPO_PATH/Dockerfile --build-arg VITE_APP_ENV="$VITE_APP_ENV" --build-arg VITE_APP_BACK_URL="$VITE_APP_BACK_URL" -t "$CI_REGISTRY_IMAGE:$CI_TAG_NAME" .
}

docker_tag() {
  echo "Tagging docker image..."
    docker tag "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" "$CI_REGISTRY_IMAGE:$CI_TAG_NAME"
}

docker_tag_latest() {
  echo "Tagging docker image..."
    docker tag "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" "$CI_REGISTRY_IMAGE:latest"
}

docker_login() {
  echo "Logging in to docker registry..."
  echo "$CI_REGISTRY_TOKEN" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
}

docker_push() {
  echo "Pushing docker image..."
    docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
}

docker_push_tag() {
  echo "Pushing docker image..."
    docker push "$CI_REGISTRY_IMAGE:$CI_TAG_NAME"
}

docker_push_latest() {
  echo "Pushing docker image..."
    docker push "$CI_REGISTRY_IMAGE:latest"
}

docker_pull() {
  echo "Pulling docker image..."
    docker pull "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
}

docker_pull_tag() {
  echo "Pulling docker image..."
    docker pull "$CI_REGISTRY_IMAGE:$CI_TAG_NAME"
}

docker_pull_latest() {
  echo "Pulling docker image..."
    docker pull "$CI_REGISTRY_IMAGE:latest"
}

docker_start() {
  echo "Starting docker container..."
    TZ='UTC' docker compose -f "$REPO_PATH/docker-compose.yml" -p "front-$NODE_ENV" --env-file "$REPO_PATH/.env.$NODE_ENV" up -d
}

docker_stop() {
  echo "Stopping docker container..."
    TZ='UTC' docker compose -p "front-$NODE_ENV" -f "$REPO_PATH/docker-compose.yml" --env-file "$REPO_PATH/.env.$NODE_ENV" down || true
}

docker_remove() {
  echo "Removing docker containers..."
    TZ='UTC' docker compose -p "front-$NODE_ENV" -f "$REPO_PATH/docker-compose.yml" --env-file "$REPO_PATH/.env.$NODE_ENV" down --rmi all || true
}



# Check if the environment file exists and export variables
export_env_variables() {
    local env_file="$1/.env.$2"

    if [ -f "$env_file" ]; then
        # shellcheck disable=SC2046
        export $(grep -v '^#' "$env_file" | tr -d '\r' | xargs)
    else
        echo "Environment file $env_file not found."
        exit 1
    fi
}

# Display the help message
show_usage() {
    echo "Usage: $0 [-h|--help] [-e|--env <environment>] [-f|--function <function>] [-p|--path <path>]"
    echo "Options:"
    echo "  -h, --help                     Display this help message"
    echo "  -e, --env <environment>        Specify the environment"
    echo "  -f, --function <function>      Specify the function to execute"
    echo "  -p, --path <path>              Specify the path to the repository (default: current directory)"
    exit 0
}

# Check if the function exists and execute it
execute_function() {
    local function_name="$1"
    shift

    if declare -f "$function_name" > /dev/null; then
        "$function_name" "$@"
    else
        echo "Function $function_name not found."
        exit 1
    fi
}

# Path to the repository (default is current directory)
REPO_PATH="."

# Parse command line options
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_usage
            ;;
        -e|--env)
            if [[ -n $2 ]]; then
                ENV="$2"
                shift
            else
                echo "Missing argument for option $1"
                show_usage
            fi
            ;;
        -f|--function)
            if [[ -n $2 ]]; then
                FUNCTION="$2"
                shift
            else
                echo "Missing argument for option $1"
                show_usage
            fi
            ;;
        -p|--path)
            if [[ -n $2 ]]; then
                REPO_PATH="$2"
                shift
            else
                echo "Missing argument for option $1"
                show_usage
            fi
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            ;;
    esac
    shift
done
# Validate required options
if [[ -z $FUNCTION ]]; then
    echo "Missing required option: -f|--function"
    show_usage
fi

if [[ -z $ENV ]]; then
    echo "Missing required option: -e|--env"
    show_usage
fi

echo "Environment: $ENV"
echo "Function: $FUNCTION"
echo "Path: $REPO_PATH"


export_env_variables "$REPO_PATH" "$ENV"
# Execute the specified function
execute_function "$FUNCTION"


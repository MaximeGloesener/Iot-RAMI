#!/bin/bash

# Check arguments number (we can deal with 0, 2 or "tandem" with a broker)
if [ "$#" -ne 0 ] && [ "$#" -ne 2 ] && ([ "$#" -ne 2 ] || [ "$1" != "duo" ]); then
    echo "Usage: ./mqttCliApp.sh [mode] [broker] | duo [broker]"
    exit 1
fi

# Function to open a new terminal and run a command
open_terminal_and_run() {
    local command=$1
    case "$OSTYPE" in
        linux-gnu*)
            gnome-terminal -- bash -c "$command; exec bash"
            ;;
        darwin*)
            osascript -e "tell application \"Terminal\" to do script \"$command\""
            ;;
        msys*|cygwin*|win32*)
            start cmd.exe /k "$command"
            ;;
        *)
            echo "Unsupported OS: $OSTYPE"
            exit 1
            ;;
    esac
}

# Execute the program
if [ "$#" -eq 0 ]; then
    python3 mqttCliApp.py
elif [ "$1" == "duo" ]; then
    BROKER=$2
    open_terminal_and_run "python3 mqttCliApp.py sensor $BROKER"
    open_terminal_and_run "python3 mqttCliApp.py server $BROKER"
else
    MODE=$1
    BROKER=$2
    python3 mqttCliApp.py $MODE $BROKER
fi

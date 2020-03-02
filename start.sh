#!/bin/sh

# Start and wait for Xvfb
Xvfb ${DISPLAY} -screen 0 "1024x768x24" -ac +extension GLX +render -noreset  -nolisten tcp  &
Xvfb_pid="$!"
while ! xdpyinfo -display ${DISPLAY} > /dev/null 2>&1; do
    sleep 0.1
done

# Starting mbgl-renderer server
node index.js
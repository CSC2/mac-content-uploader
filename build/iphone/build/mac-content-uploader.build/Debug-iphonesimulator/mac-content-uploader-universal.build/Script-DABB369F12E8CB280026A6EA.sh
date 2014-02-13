#!/bin/sh
if [ "x$TITANIUM_CLI_XCODEBUILD" == "x" ]; then
    /usr/local/Cellar/node/0.10.24/bin/node "/usr/local/bin/titanium" build --platform iphone --sdk 3.2.1.GA --no-prompt --no-progress-bars --no-banner --no-colors --build-only --xcode
    exit $?
else
    echo "skipping pre-compile phase"
fi

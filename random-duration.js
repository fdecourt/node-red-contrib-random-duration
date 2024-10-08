module.exports = function (RED) {
    function RandomDurationNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = config.name;

        // Output configuration
        node.output = config.output || 'payload'; // Default output property is 'payload'
        node.outputType = config.outputType || 'msg';
        node.outputFormat = config.outputFormat || 'hh:mm:ss'; // Default output format

        // Minimum duration configuration
        node.minTimeConfig = config.minTime; // Minimum duration from configuration
        node.minTimeFrom = config.minTimeFrom || 'from'; // Default input property for minimum duration
        node.minTimeFromType = config.minTimeFromType || 'msg';

        // Maximum duration configuration
        node.maxTimeConfig = config.maxTime; // Maximum duration from configuration
        node.maxTimeFrom = config.maxTimeFrom || 'to'; // Default input property for maximum duration
        node.maxTimeFromType = config.maxTimeFromType || 'msg';

        /**
         * Parses a time string in HH:mm:ss format and returns the total number of seconds.
         * @param {string} timeStr - The time string to parse.
         * @returns {number} - Total seconds.
         * @throws {Error} - If the time string is invalid.
         */
        function parseTime(timeStr) {
            var parts = timeStr.split(':');
            if (parts.length !== 3) {
                throw new Error("Time format must be HH:mm:ss");
            }
            var hours = parseInt(parts[0], 10);
            var minutes = parseInt(parts[1], 10);
            var seconds = parseInt(parts[2], 10);
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                throw new Error("Invalid time value");
            }
            return (hours * 3600) + (minutes * 60) + seconds;
        }

        /**
         * Formats the duration according to the specified output format.
         * @param {number} totalSeconds - The total number of seconds.
         * @param {string} format - The output format.
         * @returns {*} - The formatted duration.
         */
        function formatDuration(totalSeconds, format) {
            switch (format) {
                case 'hh:mm:ss':
                    var hours = Math.floor(totalSeconds / 3600);
                    var minutes = Math.floor((totalSeconds % 3600) / 60);
                    var seconds = totalSeconds % 60;
                    return [hours, minutes, seconds].map(function (unit) {
                        return unit < 10 ? '0' + unit : unit;
                    }).join(':');
                case 'seconds':
                    return totalSeconds;
                case 'milliseconds':
                    return totalSeconds * 1000;
                case 'object':
                    return {
                        hours: Math.floor(totalSeconds / 3600),
                        minutes: Math.floor((totalSeconds % 3600) / 60),
                        seconds: totalSeconds % 60
                    };
                case 'iso':
                    // ISO 8601 Duration format
                    var isoHours = Math.floor(totalSeconds / 3600);
                    var isoMinutes = Math.floor((totalSeconds % 3600) / 60);
                    var isoSeconds = totalSeconds % 60;
                    var isoString = 'PT';
                    if (isoHours > 0) isoString += isoHours + 'H';
                    if (isoMinutes > 0) isoString += isoMinutes + 'M';
                    if (isoSeconds > 0 || isoString === 'PT') isoString += isoSeconds + 'S';
                    return isoString;
                default:
                    throw new Error("Unsupported output format: " + format);
            }
        }

        node.on('input', function (msg, send, done) {
            try {
                // Determine minimum duration
                var minTimeStr = node.minTimeConfig;
                if (!minTimeStr) {
                    // Get minimum duration from the specified input property
                    minTimeStr = RED.util.getMessageProperty(msg, node.minTimeFrom);
                }

                // Determine maximum duration
                var maxTimeStr = node.maxTimeConfig;
                if (!maxTimeStr) {
                    // Get maximum duration from the specified input property
                    maxTimeStr = RED.util.getMessageProperty(msg, node.maxTimeFrom);
                }

                if (!minTimeStr || !maxTimeStr) {
                    throw new Error("Minimum and maximum durations must be specified either in the node configuration or in the message properties");
                }

                var minSeconds = parseTime(minTimeStr);
                var maxSeconds = parseTime(maxTimeStr);

                if (minSeconds > maxSeconds) {
                    throw new Error("Minimum duration must be less than or equal to maximum duration");
                }

                // Generate a random duration between minSeconds and maxSeconds
                var randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;

                // Format the duration according to the output format
                var formattedDuration = formatDuration(randomSeconds, node.outputFormat);

                // Use 'payload' as default output property if none specified
                var outputProperty = node.output || 'payload';

                // Set the generated duration into the specified property of msg
                RED.util.setMessageProperty(msg, outputProperty, formattedDuration, true);

                // Send the modified message
                send(msg);
                if (done) {
                    done();
                }
            } catch (err) {
                // Handle errors and report them in Node-RED
                node.error(err.message, msg);
                if (done) {
                    done(err);
                }
            }
        });
    }
    RED.nodes.registerType('random-duration', RandomDurationNode);
};

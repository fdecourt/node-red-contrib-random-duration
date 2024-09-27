# node-red-contrib-random-duration

A Node-RED node that generates a random duration between specified minimum and maximum values in `HH:mm:ss` format.

## Overview

`node-red-contrib-random-duration` is a Node-RED node that allows you to generate a random duration between two specified times. You can configure fixed minimum and maximum durations or specify them dynamically from incoming message properties. The generated duration can be output to any message property of your choice.

## Features

- **Flexible Input Options**: Use fixed durations or retrieve them from message properties.
- **Customizable Output**: Specify where in the message the generated duration should be stored.
- **Format Compliance**: All durations are handled in `HH:mm:ss` format.
- **Error Handling**: Provides informative error messages for missing or improperly formatted inputs.
- **Nested Property Support**: Works with nested message properties for both input and output.

## Installation

Not ready yet ;-)

## Usage

### Adding the Node

After installation, the random-duration node will appear in the function category of your Node-RED palette.

## Configuration

### Fields
- **Name**: (Optional) A label for the node displayed in the editor.
- **Output to**: (Optional) Specifies where in the message to store the generated duration. Defaults to msg.payload if left empty.
- **Minimum Duration (HH:mm:ss)**: (Optional) A fixed minimum duration. If left empty, the node will use the value from **'Input From (Minimum)'**.
- **Input From (Minimum)**: (Optional) Specifies the message property to use for the minimum duration if 'Minimum Duration' is empty. Defaults to msg.from.
- **Maximum Duration (HH:mm:ss)**: (Optional) A fixed maximum duration. If left empty, the node will use the value from **'Input From (Maximum)'**.
- **Input From (Maximum)**: (Optional) Specifies the message property to use for the maximum duration if 'Maximum Duration' is empty. Defaults to msg.to.

## Helper Tips

If you provide values in the 'Minimum Duration' and 'Maximum Duration' fields, those will be used for generating the random duration.

If you leave the 'Minimum Duration' and 'Maximum Duration' fields empty, the node will use the properties specified in 'Input From (Minimum)' and 'Input From (Maximum)' from the incoming message.

The 'Output to' field determines where in the message the generated duration will be stored. By default, it is msg.payload.

All durations must be in HH:mm:ss format.

#!/bin/bash

# This script simulates adding a shadcn/ui component to a project.
# In a real scenario, this would involve running the shadcn/ui CLI command.

COMPONENT_NAME=$1

if [ -z "$COMPONENT_NAME" ]; then
  echo "Usage: ./add_component.sh <component-name>"
  exit 1
fi

echo "Simulating: npx shadcn-ui add $COMPONENT_NAME"
echo "Component '$COMPONENT_NAME' added successfully (simulated)."

# In a real scenario, you would execute:
# npx shadcn-ui add $COMPONENT_NAME

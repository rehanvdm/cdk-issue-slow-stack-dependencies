#!/usr/bin/env node
import 'source-map-support/register';
import {App, Names, Stack,} from "aws-cdk-lib";

const app = new App();
const numberOfWaves = 10;
const numberOfStacks = 10;

class DebugStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
  }

  addDependency(target: Stack, reason?: string) {
    (this as any)._stackDependencies[Names.uniqueId(target)] = {
      stack: target,
      reasons: [
        {
          source: this,
          target: target,
          reason: reason,
        },
      ],
    };
  }
}

function createWaveStacks(app: App, waveNumber: number, numberOfStacks: number,
                          previousWaveStacks: Stack[] = []): Stack[] {
  const waveStacks: Stack[] = [];
  for (let i = 0; i < numberOfStacks; i++) {
    const stack = new DebugStack(app, `CdkWave${waveNumber}-${i}`);
    waveStacks.push(stack);

    for (const previousStack of previousWaveStacks) {
      stack.addDependency(previousStack);
      console.log(`${new Date().toLocaleTimeString()} - Adding dependency from stack ${previousStack.node.id} to stack ${stack.node.id}`);
    }
  }
  return waveStacks;
}

// console.log("HEAP BEFORE", process.memoryUsage());
let previousWaveStacks: Stack[] = [];
for (let waveNumber = 1; waveNumber <= numberOfWaves; waveNumber++) {
  previousWaveStacks = createWaveStacks(app, waveNumber, numberOfStacks, previousWaveStacks);
}
app.synth();
// console.log("HEAP AFTER", process.memoryUsage());
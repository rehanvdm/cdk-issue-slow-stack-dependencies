#!/usr/bin/env node
import 'source-map-support/register';
import {App,Stack,} from "aws-cdk-lib";

const app = new App();
const numberOfWaves = 9;
const numberOfStacks = 10;

function createWaveStacks(app: App, waveNumber: number, numberOfStacks: number,
                          previousWaveStacks: Stack[] = []): Stack[] {
  const waveStacks: Stack[] = [];
  for (let i = 0; i < numberOfStacks; i++) {
    const stack = new Stack(app, `CdkWave${waveNumber}-${i}`);
    waveStacks.push(stack);

    for (const previousStack of previousWaveStacks) {
      stack.addDependency(previousStack);
      console.log(`${new Date().toLocaleTimeString()} - Adding dependency from stack ${previousStack.node.id} to stack ${stack.node.id}`);
    }
  }
  return waveStacks;
}

let previousWaveStacks: Stack[] = [];
for (let waveNumber = 1; waveNumber <= numberOfWaves; waveNumber++) {
  previousWaveStacks = createWaveStacks(app, waveNumber, numberOfStacks, previousWaveStacks);
}
app.synth();
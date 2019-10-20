import { resolve } from 'path';
import { access, mkdir, writeFile } from 'fs';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { platform } from 'os';
import { ucFirst } from '../utils/utils';

const accessAsync = promisify(access);
const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

const packajeJson: any = {
  version: '1.0.0',
  scripts: {
    lint: 'tslint',
    start: 'stepsas run',
    build: 'stepsas build'
  },
  devDependencies: {
    '@types/node': '^12.11.1',
    'ts-node': '^8.3.0',
    'tslint': '^5.19.0',
    'typescript': '^3.6.2'
  },
  dependencies: {
    '@stepsas/core': '^0.1.6',
    '@stepsas/http': '0.0.2',
    '@webcomponents/custom-elements': '^1.2.4',
    'rxjs': '^6.5.2'
  }
};

const tsConfigJson: any = {
  compilerOptions: {
    target: 'ES2015',
    module: 'commonjs',
    lib: ['dom', 'es2019'],
    moduleResolution: 'node',
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  }
};

const tsLintJson: any = {
  defaultSeverity: 'error',
  extends: [
      'tslint:recommended'
  ],
  jsRules: {},
  rules: {
      'quotemark': [
          true,
          'single'
      ],
      'no-console': false,
      'trailing-comma': false,
      'callable-types': false,
      'new-parens': false,
      'ordered-imports': false,
      'indent': false,
      'object-literal-sort-keys': false,
      'interface-name': false
  },
  rulesDirectory: []
};

export default async function(projectName: string, skipInstall = false): Promise<void> {
  try {
    await accessAsync(resolve(process.cwd(), projectName));
    process.stderr.write(`Directory with this name(${projectName}) is already exists. Please use another name\n`);
  } catch (err1) {
    try {
      await mkdirAsync(resolve(process.cwd(), projectName));
      await mkdirAsync(resolve(process.cwd(), projectName, 'src'));
      await mkdirAsync(resolve(process.cwd(), projectName, 'src', 'assets'));
      await mkdirAsync(resolve(process.cwd(), projectName, 'src', 'app'));

      packajeJson.name = projectName.toLowerCase();
      await writeFileAsync(resolve(process.cwd(), projectName, 'package.json'), JSON.stringify(packajeJson, null, 2));
      await writeFileAsync(resolve(process.cwd(), projectName, 'tsconfig.json'), JSON.stringify(tsConfigJson, null, 2));
      await writeFileAsync(resolve(process.cwd(), projectName, 'tslint.json'), JSON.stringify(tsLintJson, null, 2));

      await generateProjectFiles(projectName);

      if (!skipInstall) {
        const npmCmd = platform().startsWith('win') ? 'npm.cmd' : 'npm';
        spawn(npmCmd, ['install'], {
          cwd: resolve(process.cwd(), projectName),
          stdio: 'inherit'
        }).on('close', () => {
          process.stdout.write(`Project ${projectName} was successfully created\n`);
        });
      }
      process.stdout.write(`Project ${projectName} was successfully created\n`);
    } catch (err2) {
      console.log(err2);
      process.stderr.write('Cannot create project\n');
    }
  }
}

async function generateProjectFiles(projectName: string): Promise<void[]> {
  return Promise.all([
    writeIndexHtml(projectName),
    writeAppModuleTs(projectName),
    writeAppComponentTs(projectName),
    writeAppComponentHtml(projectName),
    writeMainTs(projectName),
    writestylesScss(projectName)
  ]);
}

async function writeIndexHtml(projectName: string): Promise<void> {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${ucFirst(projectName)}</title>
</head>
<body>

  <app-root></app-root>

</body>
</html>`;
  return writeFileAsync(resolve(process.cwd(), projectName, 'src', 'index.html'), indexHtml);
}

async function writestylesScss(projectName: string): Promise<void> {
  const stylesScss = `h1{
  font-size: 20px;
}`;
  return writeFileAsync(resolve(process.cwd(), projectName, 'src', 'styles.scss'), stylesScss);
}

async function writeMainTs(projectName: string): Promise<void> {
  const mainTs = `import { AppModule } from './app/app.module';

AppModule.bootstrap();
`;
  return writeFileAsync(resolve(process.cwd(), projectName, 'src', 'main.ts'), mainTs);
}

async function writeAppModuleTs(projectName: string): Promise<void> {
  const appModule = `import { SsModule } from '@stepsas/core';
import { HttpModule } from '@stepsas/http';

// Components
import { AppComponent } from './app.component';

// Providers

@SsModule({
  components: [
    AppComponent
  ],
  imports: [
    HttpModule
  ],
  providers: []
})
export class AppModule {

  public static bootstrap(): void {

  }
}
`;
  return writeFileAsync(resolve(process.cwd(), projectName, 'src', 'app', 'app.module.ts'), appModule);
}

async function writeAppComponentTs(projectName: string): Promise<void> {
  const appComponentTs = `import { Component, ConnectedCallback, DisconnectedCallback } from '@stepsas/core';

@Component({
    selector: 'app-root',
    template: require('./app.component.html')
})
export class AppComponent extends HTMLElement implements ConnectedCallback, DisconnectedCallback {

  constructor() {
    super();
  }

  public connectedCallback(): void { }

  public disconnectedCallback(): void { }
}
`;
  return writeFileAsync(resolve(process.cwd(), projectName, 'src', 'app', 'app.component.ts'), appComponentTs);
}

async function writeAppComponentHtml(projectName: string): Promise<void> {
  const appComponentHtml = `<h1>App Works!</h1>
`;
  return writeFileAsync(resolve(process.cwd(), projectName, 'src', 'app', 'app.component.html'), appComponentHtml);
}

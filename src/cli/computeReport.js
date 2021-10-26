const SUPPORTED_FILE_EXTENSIONS = ['js', 'ts', 'tsx'];
const FILES_TO_EXCLUDE = [
    '.test.tsx',
    '.test.ts',
    '.unit.ts',
    '.unit.tsx',
    '.d.ts',
    '.config.js',
    'setupJest.ts',
    'test-utils.tsx',
    '.eslintrc.js',
    'setupTests.ts'
  ];
const FOLDERS_TO_EXCLUDE = [
    'node_modules',
    'cypress',
    'tests',
    '.github',
    '.storybook',
    'frontend/build',
    'frontend/test',
    'frontend/webpack',
    '__tests__',
    '__mocks__'
];

var execSync = require('child_process').execSync;

const fs = require('fs');
const path = require('path');

function calculateChildrenMetrics(childrenNode) {
    return Object.keys(childrenNode).reduce(
        (accumulator, child) => {
            const childMetric = childrenNode[child].metrics;
            Object.keys(childMetric).map((metricName) => {
                accumulator[metricName] = accumulator[metricName] ? accumulator[metricName] + childMetric[metricName]: childMetric[metricName];
            });

            return accumulator;
        }, {}
    )
}

const buildNodeMetrics = (directoryPath, sourceFolder) => {
    const files = fs.readdirSync(directoryPath);

    return files.reduce((accumulator, node) => {
        let isDirectory = false;

        try {
          const stats = fs.statSync(directoryPath + '/' + node)
          isDirectory = stats.isDirectory();

        } catch (error) {
          console.log(`Warning: failed to get stats on "${directoryPath}/${node}"`);

          return accumulator;
        }

        const metric = isDirectory ?
            buildDirectoryMetric(directoryPath, node, sourceFolder):
            buildFileMetric(directoryPath, node, sourceFolder);

        if (null === metric) {
            return accumulator;
        }

        return {
            ...accumulator,
            [node]: metric
        }
    }, {});
}

const buildDirectoryMetric = (directoryPath, directoryName, sourceFolder) => {
    const currentPath = `${directoryPath}/${directoryName}`;
    const childrenNode = buildNodeMetrics(currentPath, sourceFolder);
    const directoryIsEmpty = Object.keys(childrenNode).length === 0;
    if (directoryIsEmpty) {
        return null;
    }
    if (FOLDERS_TO_EXCLUDE.includes(directoryName) || FOLDERS_TO_EXCLUDE.some((folderToExclude) => currentPath.includes(folderToExclude))) {
        return null;
    }

    const nodeMetrics = {
        type: 'directory',
        directoryPath: directoryPath,
        path: currentPath,
        name: directoryName,
        children: childrenNode,
        metrics: calculateChildrenMetrics(childrenNode),
    };


    return nodeMetrics;
}

function buildFileMetric(directoryPath, fileName, sourceFolder) {
    const fileExtension = fileName.split('.').pop();
    if (!SUPPORTED_FILE_EXTENSIONS.includes(fileExtension)) {
        return null;
    }
    if (FILES_TO_EXCLUDE.some((fileToExclude) => fileName.includes(fileToExclude))) {
        return null;
    }

    const fileMetrics = getFileMetrics(directoryPath + '/' + fileName)

    return {
        type: 'file',
        directoryPath: directoryPath.replace(sourceFolder, ''),
        path: `${directoryPath.replace(sourceFolder, '')}/${fileName}`,
        name: fileName,
        metrics: fileMetrics
    }
}

const readFile = (filePath) => {
    const file = fs.readFileSync(filePath);

    return file.toString('utf8');
}

const countOccurrences = (content, regexToCount) => {
    return (content.match(regexToCount) || []).length;
};

const getFileMetrics = (filePath) => {
    const fileContent = readFile(filePath);

    const isTypescript = filePath.includes('.ts') || filePath.includes('.tsx');
    const isJavascript = filePath.includes('.js');

    const requireInJavascript = isJavascript ? countOccurrences(fileContent, /require\(/g) : 0;
    const requireInTypescript = isTypescript ? countOccurrences(fileContent, /require\(/g) : 0;
    const defineInJavascript = isJavascript ? countOccurrences(fileContent, /define\(/g) : 0;
    const reactClassComponent = countOccurrences(fileContent, /extends React.Component/g);
    const reactController = countOccurrences(fileContent, /extends ReactController/g);
    const backboneController = countOccurrences(fileContent, /extends BaseController/g) + countOccurrences(fileContent, /BaseController.extend/g);

    const bemInTypescript = isTypescript && (
        -1 !== fileContent.indexOf(`className='Akn`) ||
        -1 !== fileContent.indexOf(`className='Akn`) ||
        -1 !== fileContent.indexOf(`className={\`Akn`)) ? 1 : 0;

    const loc = parseInt(execSync(`wc -l ${filePath}`).toString().trim());

    return {
        typescript: isTypescript ? 1 : 0,
        javascript: isJavascript ? 1 : 0,
        typescriptLOC: isTypescript ? loc : 0,
        javascriptLOC: isJavascript ? loc : 0,
        requireInJavascript,
        requireInTypescript,
        defineInJavascript,
        reactClassComponent,
        bemInTypescript,
        reactController,
        backboneController,
    };
};



const computeReport = (creationDate, sourceFolder) => {
  const directoryPath = path.dirname(sourceFolder);
  const directoryName = path.parse(sourceFolder).base;

  const nodeMetric = buildDirectoryMetric(directoryPath, directoryName, sourceFolder);
  return {
      creationDate: creationDate.getTime(),
      nodeReport: nodeMetric
  }
}

module.exports = {computeReport}

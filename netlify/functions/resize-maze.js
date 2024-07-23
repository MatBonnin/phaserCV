const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    function resizeMaze(size) {
      function transformLabyrinth(inputString, rows, cols) {
        // Transformer la chaîne de caractères en une liste de listes
        let labyrinth = [];
        for (let i = 0; i < rows; i++) {
          labyrinth.push(inputString.slice(i * cols, (i + 1) * cols).split(''));
        }

        const height = labyrinth.length;
        const width = labyrinth[0].length;
        let result = Array.from({ length: height }, () => Array(width).fill(0));

        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            if (labyrinth[i][j] === 'c') {
              const isTopEdge = i === 0; // Vérifie si on est au bord supérieur
              const isDownEdge = i === height - 1; // Vérifie si on est au bord inferieur

              if (isTopEdge || isDownEdge) {
                result[i][j] = 1221;
              } else {
                result[i][j] = 0;
              }
            } else if (labyrinth[i][j] === 'w') {
              // Déterminer les voisins, en gérant les bordures de la carte
              const top = i > 0 && labyrinth[i - 1][j] === 'c';
              const bottom = i < height - 1 && labyrinth[i + 1][j] === 'c';
              const left = j > 0 && labyrinth[i][j - 1] === 'c';
              const right = j < width - 1 && labyrinth[i][j + 1] === 'c';
              const isTopEdge = i === 0; // Vérifie si on est au bord supérieur
              const isLeftEdge = j === 0;

              // Attribuer les bons numéros aux 'w' selon les règles
              if (left && bottom && top && right) {
                result[i][j] = 523; // Cas spécifique 1
              } else if (left && !top && bottom && !right) {
                result[i][j] = 602;
              } else if (left && top && !bottom && !right) {
                result[i][j] = 522; // angle bas droit
              } else if (right && top && !left && !bottom) {
                result[i][j] = 524; // angle gauche bas
              } else if (top && !left && bottom && !right) {
                result[i][j] = 523;
              } else if (!top && !left && bottom && right) {
                result[i][j] = 604;
              } else if (top && left && !bottom && right) {
                result[i][j] = 561;
              } else if (top && !left && bottom && right) {
                result[i][j] = 642;
              } else if (top && left && bottom && !right) {
                result[i][j] = 641;
              } else if (left && !bottom && !top && right) {
                result[i][j] = 564; // Cas spécifique 2
              } else if (left && bottom && !top && !right) {
                result[i][j] = 602; // Cas spécifique 3
              } else if (!left && !bottom && !top && !right) {
                result[i][j] = 564; // Cas spécifique 3
              } else if (left && bottom && !top && right) {
                result[i][j] = 601; // Cas spécifique 4
              } else if (left && !right && !top && !bottom) {
                result[i][j] = 564; // Bord gauche vertical
              } else if (!left && right && !top && !bottom) {
                result[i][j] = 564; // Bord droit vertical
              } else if (!left && !right && top && !bottom) {
                result[i][j] = 523; // Bord haut horizontal
              } else if (!left && !right && !top && bottom) {
                result[i][j] = 523; // Bord bas horizontal
              } else {
                result[i][j] = 204; // Autres cas, par défaut à un bord
              }
            }
          }
        }

        return result;
      }

      const cote = size;
      // Exemple d'utilisation de la fonction:
      const inputString = generate_maze(cote, cote);
      const rows = cote;
      const cols = cote;
      let finalString = '';
      const transformedLabyrinth = transformLabyrinth(inputString, rows, cols);
      for (const row of transformedLabyrinth) {
        finalString += row.join(',') + ',';
      }

      fs.readFile('public/assets/map/laby.tmj', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let tmjData = JSON.parse(data);

        // Insérer finalString dans le tableau data correspondant dans layers
        tmjData.layers.forEach((layer) => {
          if (layer.name === 'mur') {
            // Nom du calque où insérer les données
            layer.data = finalString.slice(0, -1).split(',').map(Number);
          }
          if (layer.name === 'Ground') {
            // Nom du calque où insérer les données
            layer.data = Array(cote * cote).fill(1);
          }
        });

        // Parcourir le JSON pour remplacer 'height' et 'width' par la valeur de 'cote'
        function replaceHeightWidth(data, cote) {
          if (Array.isArray(data)) {
            data.forEach((item) => replaceHeightWidth(item, cote));
          } else if (typeof data === 'object' && data !== null) {
            for (const key in data) {
              if (key === 'height' || key === 'width') {
                data[key] = parseInt(cote);
              } else {
                replaceHeightWidth(data[key], cote);
              }
            }
          }
        }

        replaceHeightWidth(tmjData, cote);

        // Sauvegarder les modifications dans le fichier tmj
        fs.writeFile(
          'public/assets/map/laby.tmj',
          JSON.stringify(tmjData, null, 4),
          'utf8',
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(finalString.slice(0, -1));
          }
        );
      });
    }

    function generate_maze(height, width) {
      // Functions
      function printMaze(maze) {
        let mazeString = '';
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            mazeString += maze[i][j] + ' ';
          }
        }
        return mazeString;
      }

      // Find number of surrounding cells
      function surroundingCells(randWall) {
        let sCells = 0;
        if (maze[randWall[0] - 1][randWall[1]] === 'c') sCells += 1;
        if (maze[randWall[0] + 1][randWall[1]] === 'c') sCells += 1;
        if (maze[randWall[0]][randWall[1] - 1] === 'c') sCells += 1;
        if (maze[randWall[0]][randWall[1] + 1] === 'c') sCells += 1;
        return sCells;
      }

      // Main code
      const wall = 'w';
      const cell = 'c';
      const unvisited = 'u';
      let maze = [];

      // Denote all cells as unvisited
      for (let i = 0; i < height; i++) {
        let line = [];
        for (let j = 0; j < width; j++) {
          line.push(unvisited);
        }
        maze.push(line);
      }

      // Randomize starting point and set it a cell
      let startingHeight = Math.floor(Math.random() * height);
      let startingWidth = Math.floor(Math.random() * width);
      if (startingHeight === 0) startingHeight += 1;
      if (startingHeight === height - 1) startingHeight -= 1;
      if (startingWidth === 0) startingWidth += 1;
      if (startingWidth === width - 1) startingWidth -= 1;

      // Mark it as cell and add surrounding walls to the list
      maze[startingHeight][startingWidth] = cell;
      let walls = [
        [startingHeight - 1, startingWidth],
        [startingHeight, startingWidth - 1],
        [startingHeight, startingWidth + 1],
        [startingHeight + 1, startingWidth],
      ];

      // Denote walls in maze
      maze[startingHeight - 1][startingWidth] = 'w';
      maze[startingHeight][startingWidth - 1] = 'w';
      maze[startingHeight][startingWidth + 1] = 'w';
      maze[startingHeight + 1][startingWidth] = 'w';

      while (walls.length) {
        // Pick a random wall
        let randWall = walls[Math.floor(Math.random() * walls.length)];

        // Check if it is a left wall
        if (randWall[1] !== 0) {
          if (
            maze[randWall[0]][randWall[1] - 1] === 'u' &&
            maze[randWall[0]][randWall[1] + 1] === 'c'
          ) {
            let sCells = surroundingCells(randWall);
            if (sCells < 2) {
              maze[randWall[0]][randWall[1]] = 'c';

              if (randWall[0] !== 0) {
                if (maze[randWall[0] - 1][randWall[1]] !== 'c')
                  maze[randWall[0] - 1][randWall[1]] = 'w';
                if (!walls.includes([randWall[0] - 1, randWall[1]]))
                  walls.push([randWall[0] - 1, randWall[1]]);
              }
              if (randWall[0] !== height - 1) {
                if (maze[randWall[0] + 1][randWall[1]] !== 'c')
                  maze[randWall[0] + 1][randWall[1]] = 'w';
                if (!walls.includes([randWall[0] + 1, randWall[1]]))
                  walls.push([randWall[0] + 1, randWall[1]]);
              }
              if (randWall[1] !== 0) {
                if (maze[randWall[0]][randWall[1] - 1] !== 'c')
                  maze[randWall[0]][randWall[1] - 1] = 'w';
                if (!walls.includes([randWall[0], randWall[1] - 1]))
                  walls.push([randWall[0], randWall[1] - 1]);
              }

              walls = walls.filter(
                (wall) => !(wall[0] === randWall[0] && wall[1] === randWall[1])
              );
              continue;
            }
          }
        }

        // Check if it is an upper wall
        if (randWall[0] !== 0) {
          if (
            maze[randWall[0] - 1][randWall[1]] === 'u' &&
            maze[randWall[0] + 1][randWall[1]] === 'c'
          ) {
            let sCells = surroundingCells(randWall);
            if (sCells < 2) {
              maze[randWall[0]][randWall[1]] = 'c';

              if (randWall[0] !== 0) {
                if (maze[randWall[0] - 1][randWall[1]] !== 'c')
                  maze[randWall[0] - 1][randWall[1]] = 'w';
                if (!walls.includes([randWall[0] - 1, randWall[1]]))
                  walls.push([randWall[0] - 1, randWall[1]]);
              }
              if (randWall[1] !== 0) {
                if (maze[randWall[0]][randWall[1] - 1] !== 'c')
                  maze[randWall[0]][randWall[1] - 1] = 'w';
                if (!walls.includes([randWall[0], randWall[1] - 1]))
                  walls.push([randWall[0], randWall[1] - 1]);
              }
              if (randWall[1] !== width - 1) {
                if (maze[randWall[0]][randWall[1] + 1] !== 'c')
                  maze[randWall[0]][randWall[1] + 1] = 'w';
                if (!walls.includes([randWall[0], randWall[1] + 1]))
                  walls.push([randWall[0], randWall[1] + 1]);
              }

              walls = walls.filter(
                (wall) => !(wall[0] === randWall[0] && wall[1] === randWall[1])
              );
              continue;
            }
          }
        }

        // Check the bottom wall
        if (randWall[0] !== height - 1) {
          if (
            maze[randWall[0] + 1][randWall[1]] === 'u' &&
            maze[randWall[0] - 1][randWall[1]] === 'c'
          ) {
            let sCells = surroundingCells(randWall);
            if (sCells < 2) {
              maze[randWall[0]][randWall[1]] = 'c';

              if (randWall[0] !== height - 1) {
                if (maze[randWall[0] + 1][randWall[1]] !== 'c')
                  maze[randWall[0] + 1][randWall[1]] = 'w';
                if (!walls.includes([randWall[0] + 1, randWall[1]]))
                  walls.push([randWall[0] + 1, randWall[1]]);
              }
              if (randWall[1] !== 0) {
                if (maze[randWall[0]][randWall[1] - 1] !== 'c')
                  maze[randWall[0]][randWall[1] - 1] = 'w';
                if (!walls.includes([randWall[0], randWall[1] - 1]))
                  walls.push([randWall[0], randWall[1] - 1]);
              }
              if (randWall[1] !== width - 1) {
                if (maze[randWall[0]][randWall[1] + 1] !== 'c')
                  maze[randWall[0]][randWall[1] + 1] = 'w';
                if (!walls.includes([randWall[0], randWall[1] + 1]))
                  walls.push([randWall[0], randWall[1] + 1]);
              }

              walls = walls.filter(
                (wall) => !(wall[0] === randWall[0] && wall[1] === randWall[1])
              );
              continue;
            }
          }
        }

        // Check the right wall
        if (randWall[1] !== width - 1) {
          if (
            maze[randWall[0]][randWall[1] + 1] === 'u' &&
            maze[randWall[0]][randWall[1] - 1] === 'c'
          ) {
            let sCells = surroundingCells(randWall);
            if (sCells < 2) {
              maze[randWall[0]][randWall[1]] = 'c';

              if (randWall[1] !== width - 1) {
                if (maze[randWall[0]][randWall[1] + 1] !== 'c')
                  maze[randWall[0]][randWall[1] + 1] = 'w';
                if (!walls.includes([randWall[0], randWall[1] + 1]))
                  walls.push([randWall[0], randWall[1] + 1]);
              }
              if (randWall[0] !== height - 1) {
                if (maze[randWall[0] + 1][randWall[1]] !== 'c')
                  maze[randWall[0] + 1][randWall[1]] = 'w';
                if (!walls.includes([randWall[0] + 1, randWall[1]]))
                  walls.push([randWall[0] + 1, randWall[1]]);
              }
              if (randWall[0] !== 0) {
                if (maze[randWall[0] - 1][randWall[1]] !== 'c')
                  maze[randWall[0] - 1][randWall[1]] = 'w';
                if (!walls.includes([randWall[0] - 1, randWall[1]]))
                  walls.push([randWall[0] - 1, randWall[1]]);
              }

              walls = walls.filter(
                (wall) => !(wall[0] === randWall[0] && wall[1] === randWall[1])
              );
              continue;
            }
          }
        }

        // Delete the wall from the list anyway
        walls = walls.filter(
          (wall) => !(wall[0] === randWall[0] && wall[1] === randWall[1])
        );
      }

      // Mark the remaining unvisited cells as walls
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (maze[i][j] === 'u') maze[i][j] = 'w';
        }
      }

      // Set entrance and exit
      for (let i = 0; i < width; i++) {
        if (maze[1][i] === 'c') {
          maze[0][i] = 'c';
          break;
        }
      }

      for (let i = width - 1; i > 0; i--) {
        if (maze[height - 2][i] === 'c') {
          maze[height - 1][i] = 'c';
          break;
        }
      }

      let mazeRepresentation = printMaze(maze);
      return mazeRepresentation.replace(/ /g, '');
    }

    resizeMaze(body.size);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Fichier mis à jour avec succès' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erreur lors de la mise à jour du fichier',
      }),
    };
  }
};

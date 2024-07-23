from wcgenerator import generate_maze
import json

def transform_labyrinth(input_string, rows, cols):
    # Transformer la chaîne de caractères en une liste de listes
    labyrinth = [list(input_string[i * cols:(i + 1) * cols]) for i in range(rows)]
    
    height = len(labyrinth)
    width = len(labyrinth[0])
    result = [[0] * width for _ in range(height)]
    
    for i in range(height):
        for j in range(width):  
            if labyrinth[i][j] == 'c':
                is_top_edge = i == 0  # Vérifie si on est au bord supérieur
                is_down_edge = i == height-1  # Vérifie si on est au bord inferieur

                if is_top_edge:
                    result[i][j] = 1221
                elif is_down_edge:
                    result[i][j] = 1221
                else:
                    result[i][j] = 0
                
            elif labyrinth[i][j] == 'w':
                # Déterminer les voisins, en gérant les bordures de la carte
                top = i > 0 and labyrinth[i-1][j] == 'c'
                bottom = i < height - 1 and labyrinth[i+1][j] == 'c'
                left = j > 0 and labyrinth[i][j-1] == 'c'
                right = j < width - 1 and labyrinth[i][j+1] == 'c'
                is_top_edge = i == 0  # Vérifie si on est au bord supérieur
                is_left_edge = j == 0
                
                #  angle bas droit :522, Bord horizontale : 523, angle gauche bas : 524,  Bord vertical: 564, angle haut droit : 602, , angle haut gauche : 604, fin cehmin verticale bas : 601,fin chemin horizontale droite : 642,  fin chemin vertical haut : 561, fin chemin vertical gauche : 641
                
                # Attribuer les bons numéros aux 'w' selon les règles
                if left and bottom and top and right:
                    result[i][j] = 523  # Cas spécifique 1
                elif left and not top and bottom and not right:
                     result[i][j] = 602
                elif left and top and not bottom and not right:
                     result[i][j] = 522 #anggle bas droit
                elif right and top and not left and not bottom:
                     result[i][j] = 524 #anggle gauche bas
                # elif not left and not top and not bottom and right and not is_left_edge:
                #      result[i][j] = 524
                elif top and not left and bottom and not right:
                    result[i][j] = 523
                elif not top and not left and bottom and right:
                    result[i][j] = 604
                elif top and left and not bottom and right:
                    result[i][j] = 561
                elif top and not left and bottom and right:
                    result[i][j] = 642
                elif top and left and bottom and not right:
                    result[i][j] = 641
                elif left and not bottom and not top and right:
                    result[i][j] = 564  # Cas spécifique 2
                elif left and bottom and not top and not right:
                    result[i][j] = 602  # Cas spécifique 3
                elif not left and not bottom and not top and not right:
                    result[i][j] = 564  # Cas spécifique 3
                elif left and bottom and not top and right:
                    result[i][j] = 601  # Cas spécifique 4
                elif left and not right and not top and not bottom:
                    result[i][j] = 564  # Bord gauche vertical
                elif not left and right and not top and not bottom:
                    result[i][j] = 564  # Bord droit vertical
                elif not left and not right and top and not bottom:
                    result[i][j] = 523  # Bord haut horizontal
                elif not left and not right and not top and bottom:
                    result[i][j] = 523  # Bord bas horizontal
                else:
                    result[i][j] = 204  # Autres cas, par défaut à un bord
                
    return result

cote = 200
# Exemple d'utilisation de la fonction:
input_string = generate_maze(cote,cote)
rows = cote
cols = cote
finalString = ''
transformed_labyrinth = transform_labyrinth(input_string, rows, cols)
for row in transformed_labyrinth:
    finalString += ",".join(str(x) for x in row) + ","


with open('public/assets/map/laby.tmj', 'r') as file:
    tmj_data = json.load(file)

# Insérer final_string dans le tableau data correspondant dans layers
for layer in tmj_data["layers"]:
    if layer["name"] == "mur":  # Nom du calque où insérer les données
        layer["data"] = finalString[:-1].split(',')

# Sauvegarder les modifications dans le fichier tmj
with open('public/assets/map/laby.tmj', 'w') as file:
    json.dump(tmj_data, file, indent=4)
print(finalString[:-1])

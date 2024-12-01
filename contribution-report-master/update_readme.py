import sys
import os
from datetime import datetime

def get_version():
    while True:
        version = input("Entrez la version de RAMI (par exemple, 1.0): ")
        try:
            # Tente de convertir l'entrée en float
            float_version = float(version)
            return float_version
        except ValueError:
            print("Veuillez entrer un numéro de version valide sous forme de nombre décimal, par exemple '1.0'.")


def get_contributor_name():
    while True:
        contributor_name = input("Entrez votre prénom: ")
        if contributor_name.isalpha():  # Check to ensure it only contains letters
            return contributor_name
        else:
            print("Veuillez entrer un prénom valide contenant uniquement des lettres.")

def get_date(prompt):
    while True:
        date_input = input(f"Entrez la {prompt} (format DD/MM/YYYY): ")
        try:
            # Parse la date en utilisant le nouveau format
            date_obj = datetime.strptime(date_input, "%d/%m/%Y")
            return date_obj.strftime("%Y-%m-%d")  # Convertit au format "YYYY-MM-DD"
        except ValueError:
            print("Le format de la date est incorrect. Veuillez entrer la date au format DD/MM/YYYY.")


def calculate_months(start_date, end_date):
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    return (end.year - start.year) * 12 + end.month - start.month

def rename_file(original_name, new_name):
    """Renomme un fichier avec le nom spécifié.
    
    @param original_name: Le nom actuel du fichier.
    @param new_name: Le nouveau nom à donner au fichier.
    @return: None
    """
    if not os.path.exists(original_name):
        print(f"Erreur: Le fichier '{original_name}' n'existe pas et ne peut pas être rénommé !")

    try:
        os.rename(original_name, new_name)
        print(f"Le fichier {original_name} a été renommé en {new_name}")
    except OSError as e:
        print(f"Erreur lors du renommage du fichier : {e}")

def update_readme(version, contributor_name, start_date, end_date, months_duration):
    content = f"""

---
### RAMI {version} : Contribution de {contributor_name}, {start_date} - {end_date} ({months_duration} mois)
- Compte rendu succint de la contribution
- Compte rendu succint de la contribution

#### Conseils d'ensemble
1)  Conseil

#### Conseils techniques
##### Electronique
- Votre conseil

##### Informatique (Backend)
- Votre conseil

##### Informatique (Frontend)
- Votre conseil

    """

    with open("README.md", "a") as file:
        file.write(content)
    print("Le fichier README.md a été mis à jour avec succès.")

def main():
    # Vérification de l'argument de ligne de commande
    if len(sys.argv) != 2:
        print("Utilisation : python ./update_readme.py [nom_du_rapport.pdf]")
        sys.exit(1)

    # Récupération du nom du rapport
    report_name = sys.argv[1]

    # Get inputs from the user using the functions
    version = get_version()
    contributor_name = get_contributor_name()
    start_date = get_date("date de début")
    end_date = get_date("date de fin")
    months_duration = calculate_months(start_date, end_date)

    # Transformation du nom du rapport et renommage du fichier
    formatted_report_name = f"UMONS_RAMI{version}_{contributor_name}_{start_date}.pdf"
    rename_file(report_name, formatted_report_name)

    # Mise à jour du README.md
    update_readme(version, contributor_name, start_date, end_date, months_duration)



if __name__ == "__main__":
    main()
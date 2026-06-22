#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "=== Envoi de SellThem vers GitHub ==="
echo "Colle ton token GitHub (ghp_...) puis Entree :"
read -r TOKEN
if [ -z "$TOKEN" ]; then echo "Aucun token."; read -r -p "Entree pour fermer."; exit 1; fi
git init -q; git add -A; git commit -q -m "mise a jour sellthem" || echo "(rien de nouveau)"
git branch -M main; git remote remove origin 2>/dev/null
git remote add origin "https://sellthem148-bot:${TOKEN}@github.com/sellthem148-bot/sellthem.git"
echo "Envoi..."
if git push -u origin main --force; then echo ""; echo "OK ! Vercel va redeployer (1-2 min)."; else echo ""; echo "Echec : verifie ton token."; fi
echo ""; read -r -p "Entree pour fermer."

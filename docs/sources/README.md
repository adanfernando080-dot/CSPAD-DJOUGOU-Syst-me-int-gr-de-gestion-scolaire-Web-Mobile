# Documents sources CSPAD DJOUGOU

Ce dossier contient les **documents sources officiels**, conservés **tels quels**.
Chaque document est enregistré dans [`MANIFEST.json`](MANIFEST.json) avec son empreinte SHA-256.

## Règles

1. **Aucune modification.** Un fichier source n'est jamais édité, renommé, reformaté ni converti
   sur place. Prettier ignore ce dossier.
2. **Nouvelle version = nouveau fichier.** On l'ajoute avec une nouvelle entrée dans le manifeste ;
   l'ancienne version est conservée.
3. **Intégrité vérifiée.** La commande `pnpm sources:verify` échoue si :
   - un fichier ne correspond plus à son empreinte ;
   - un fichier déclaré présent est manquant ;
   - un fichier présent dans ce dossier n'est pas déclaré dans le manifeste.
   Elle tourne en CI.
4. **Transcriptions séparées.** Une transcription exploitable (par exemple un tableau de
   coefficients en texte) est un document **dérivé**. Elle est rangée hors de ce dossier
   (`docs/business-rules/`), cite l'identifiant `SRC-xx` et doit être validée par le CSPAD.

## Classement

| Dossier                   | Contenu attendu                                   |
| ------------------------- | ------------------------------------------------- |
| `specifications/`         | SRC-01 — Spécification V2.0 (source maîtresse)    |
| `cahier-des-charges/`     | SRC-02 — Projet de cahier des charges             |
| `architecture/`           | SRC-03 — Document V2.9                            |
| `coefficients-officiels/` | SRC-04, SRC-05 — Images des coefficients collège  |
| `paie-modeles/`           | SRC-06 — Modèle réel de bulletin de paie          |
| `reglementaire/`          | SRC-07 — Textes fiscaux et sociaux applicables    |

## État au 2026-09-24

**Aucun document source n'a encore été déposé.** Les 7 entrées du manifeste sont au statut
`ABSENT`. Le socle technique (Phase 1) n'en dépend pas. En revanche, aucune règle métier n'est
implémentée tant que ces documents manquent. Voir le §5 de `docs/phase-0/RAPPORT_PHASE_0.md`.

## Ajouter un document

```bash
# 1. Copier le fichier, sans le modifier, dans le bon sous-dossier
cp "~/Téléchargements/Specifications_…_V2_0_DEFINITIVE.docx" docs/sources/specifications/

# 2. Calculer son empreinte
sha256sum docs/sources/specifications/Specifications_…_V2_0_DEFINITIVE.docx

# 3. Dans MANIFEST.json, renseigner pour l'entrée concernée :
#    "status": "PRESENT", "file": "specifications/<nom exact>",
#    "sha256": "<empreinte>", "receivedAt": "AAAA-MM-JJ"

# 4. Vérifier
pnpm sources:verify
```

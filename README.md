# Vie Marine

## Glossary

> **life**: The type can be a group or a species. Object stored in database.

## Getting Started

```bash
npm install --global yarn
yarn install
yarn dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase

### Init Firebase

```bash
npm install -g firebase-tools
alias firebase="`npm config get prefix`/bin/firebase" (optional)
firebase login
firebase use sea-life-project (optional)
```

### Start emulation

```bash
firebase ext:export # Get current extension configuration (optional)
npm run build:watch --prefix functions # Compile functions
# Go to firebase/clientApp.ts and enable lines with "connectFirestoreEmulator" and "connectStorageEmulator"
firebase emulators:start --import ../firebase_export/

npm run serve:watch --prefix functions
```

### Deploy functions

```bash
firebase deploy --only functions
```

### Export current local data

```bash
firebase emulators:export ./firebase_export
```

### Other

```bash
# Setup emulator Suite manually
firebase init emulators # Select Authentication, Functions, Firestore, Storage
```

## Images

Species images are stored in google cloud storage with the following naming:
`{speciesId}/{GUID}_{width}x{width}.webp`

**Image upload lifecycle**

1. Image dropped in cloud storage `{speciesId}/{GUID}.{original_extension}`
2. _Resize Images_ extension optimize and resize images in 8 sizes (640, 750, 828, 1080, 1200, 1920, 2048, 3840)
3. Original image is deleted and the following id `{speciesId}/{GUID}` is stored in database.

**Image retrieve**

`https://firebasestorage.googleapis.com/v0/b/sea-guide.appspot.com/o/{photoId}_{width}x{width}.webp?alt=media`

Example: https://firebasestorage.googleapis.com/v0/b/sea-guide.appspot.com/o/50968%2F177fa4f7-f02d-4409-9772-d6378504c86f_1080x1080.webp?alt=media

## Algolia

Synchronize Algolia data

> **Prerequisites** <br>
> Download service account key file: https://console.firebase.google.com/u/0/project/sea-guide/settings/serviceaccounts/adminsdk

```bash
npx firestore-algolia-search

What is the Region? europe-west1
What is the Project Id? sea-guide
What is the Algolia App Id? R2SCM7OOVG
What is the Algolia Api Key? { ALGOLIA_SEARCH_ADMIN_KEY }
What is the Algolia Index Name? sea-guide
What is the Collection Path? lives
What are the Fields to extract? { empty }
What is the Transform Function? { empty }
What is the path to the Google Application Credential File? ./sea-guide-firebase-adminsdk.json
```

Change extracted field in **firestore extension**.

### Filters in search

- type = species by default
- category (ex: fishes, creatures...)
- conservation status
  LC-Least concern, EN-Endangered, NT-Near threatened, VU-Vulnerable, CR-Critically endangered, NE-Not evaluated, CD-Conservation Dependant
- location

Others: color, shape, habitat, social behavior, venomous, danger to human

## Features

- Breadcrumb for ancestors
- Similar species list
- Favorite list management
- Update life information (photos, text...)
- Display conservation status
- Improve search filters (shape, colors...)
- Improve text search including family names

## Improvement

- Static page only for species info
- Etoile de mer rouge doesnt appear in group:faune and type:species ?
- Rules for storage and firestore (prevent auth null)

## Seed

/// FISHES ///

=> Labridae (49284)
50968 - Girelle commune
50972 - Girelle paon

=> Epinephelidae (1363728)
100119 - Merou brun

/// CREATURES ///

==> Echinodermata (47549)
======> Holothuroidea (47720)
324819 - Concombre des mers
======> Etoile de mer (47668)
117446 - Etoile de mer rouge
======> Oursin (47548)
48032 - Oursin Violet

=> Cnidaria (47534)
256089 - Meduse pelagie
324852 - Meduse oeuf au plat

/// CORALS, SPONGES, PLANTS ///

=> Demospongiae (57736)
363864 - Éponge rouge
905466 - Éponge cornée noire

# Other commands

```bash
npx kill-port 8080
```

## Archive code

#### Get blob from external url and upload to storage

```ts

// Back
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.body;
  const blob = await fetch(url).then((r) => r.blob());

  res.setHeader("Content-Type", blob.type);
  const buffer = await blob.arrayBuffer();
  res.send(Buffer.from(buffer) as any);
}

// Client
const blob = await fetch("http://localhost:3000/api/getINaturalistImage", {
  method: "POST",
  mode: "cors",
  cache: "default",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
}).then((res) => res.blob());

...

const storageRef = ref(storage, `${filePath}.${extension}`);
await uploadBytes(storageRef, blob);
```

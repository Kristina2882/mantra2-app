import db from './firebase.js';
import { collection, addDoc, getDocs, connectFirestoreEmulator } from "firebase/firestore";
import express from 'express';



const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

const categories = [
   {
      catId: 1,
      catName: 'Про Миздрія'
   },
   {
      catId: 2,
      catName: 'Про сили пошлості'
   },
   {
      catId: 3,
      catName: 'Допомога в сексі'
   },
   {
      catId: 4,
      catName: 'Допомога в роботі'
   },
   {
      catId: 5,
      catName: 'Захисні мантри'
   },
   {
      catId: 6,
      catName: 'Іменні мантри'
   }
 
]

 const getMantras = async ()  => {
  const mantras = [];
  const manCol = collection(db, "mantras"); 
  const manSnapshot = await getDocs(manCol);
   manSnapshot.forEach((doc) => {
      mantras.push({
         ...doc.data(),
         mantraid: doc.id
      })
   });
   return mantras;
} 

  const getIds = async () => {
  const mantras = await getMantras();
  const ids = [];
  mantras.map((item) => {
   ids.push({
      id: ids.length + 1,
      idInDb: item.mantraid
   })
  });
  return ids;
}

function getRandomIntInclusive(min, max) {
   const minCeiled = Math.ceil(min);
   const maxFloored = Math.floor(max);
   return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
}

app.get('/', (req, res) => {
   res.render('index', {categories: categories});
});

app.get("/categories/:catId", async (req, res) => {
   const mantras = await getMantras();
   let category = categories.filter((cat) => cat.catId === parseInt(req.params.catId))[0];
   res.render('category', {category: category, mantras: mantras});
 });

app.get('/mantras/:mantraname', async (req, res) => {
   const mantras = await getMantras();
   let mantra = mantras.filter((mantra) => mantra.mantraName === req.params.mantraname)[0];
   res.render('mantra', {mantra:mantra});
});

app.get("/get-random", async (req, res) => {
const ids = await getIds();
const mantras = await getMantras();
const idId = getRandomIntInclusive(1, ids.length +1);
const mantraId = ids.filter((item) => item.id === idId)[0];
if (mantraId) {
let mantra = mantras.filter((mantra) => mantra.mantraid === mantraId.idInDb)[0];
if (mantra) {
return res.redirect('/mantras/'+ mantra.mantraName);
}
}
else {
   res.render('error');
}

});

app.post('/search-mantra', async (req, res) => {
   let mantraName = req.body.mantraName;
   const mantras = await getMantras();
   let mantra = mantras.filter((mantra) => mantra.mantraName.toLowerCase() === mantraName.toLowerCase())[0];
   if (mantra) {
   res.render('mantra', {mantra:mantra});
   } 
   else {
      res.render('error');
   }
})

app.post('/new-mantra', async (req, res) => {
   const mantras =  await getMantras();
   let newMantra = {mantraName: req.body.mantraName, mantra: req.body.mantra, mantraCat:parseInt(req.body.mantraCat)};
   await addDoc(collection(db, "mantras"), newMantra);
   return res.redirect('/mantras/'+ newMantra.mantraName);
})

const PORT = 5000;

app.listen(PORT, () => {
   console.log(`Server started http://localhost:${PORT}`);
})

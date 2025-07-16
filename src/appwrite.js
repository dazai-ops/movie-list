import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {

  // 1. Use Appwrite SDK or API to check if the searchTerm is already in the database
  try{
    // Get the document
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)])
    // console.log(result)

    // 2. If not, add the searchTerm to the database
    if(result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1
      })
      // console.log("Udah ada bang")

    } else {
      // 3. If does exist, increment the count
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      })
      // console.log("Belum ada bang")
    }
  }catch(e){
    console.log("error", e);
  }
}

export const getTrendingMovies = async () => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.orderDesc('count'),
    Query.limit(5)
  ])
    
  return result.documents
}
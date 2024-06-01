import express, { Express, Request, Response } from "express";
import cors from "cors";
import fs from "fs";

const app: Express = express();
app.use(cors());
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up!");
});

app.get("/users", (req: Request, res: Response) => {
  const users = fs.readFileSync('db/users.json');
  res.header("Content-Type",'application/json');
  res.send(users);
});

app.get("/posts", (req: Request, res: Response) => {
  const posts = fs.readFileSync('db/posts.json');
  res.header("Content-Type",'application/json');
  res.send(posts);
});

app.post("/create", (req: Request, res: Response) => {
  const posts: any = fs.readFileSync('db/posts.json');
  const data = JSON.parse(posts);
  const id = data[data.length-1].id + 1
  data.push({id: id,...req.body})
  const newData = JSON.stringify(data);
  fs.writeFileSync('db/posts.json', newData);

  res.send(newData);
});

app.delete("/delete/:id", (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  const posts: any = fs.readFileSync('db/posts.json');
  const parseData: PostData[] = JSON.parse(posts);
  const data = parseData.filter(i => i.id !== postId);
  const newData = JSON.stringify(data);
  fs.writeFileSync('db/posts.json', newData);

  res.send(newData);
});

app.post("/edit", (req: Request, res: Response) => {
  const posts: any = fs.readFileSync('db/posts.json');
  const data: PostData[] = JSON.parse(posts);
  const mappedDate: PostData[] = data.map(item => {
    return item.id === req.body.id ? {...req.body} : {...item}
  });
  const newData = JSON.stringify(mappedDate);
  fs.writeFileSync('db/posts.json', newData);
  res.send(newData);
});

app.post("/like", (req: Request, res: Response) => {
  const userId = req.body.userId;
  const postId = req.body.id;
  const posts: any = fs.readFileSync('db/posts.json');
  const data: PostData[] = JSON.parse(posts);


  const likeData = data.find(item => item.id === postId)?.like || [];
  const isLiked = likeData.find(item => item.userId === userId);

  const mappedDate: PostData[] = data.map(item => {
    if(item.id === postId) {
      if(isLiked) {
        const like = item.like ? item.like.filter(i => i.userId !== userId) : [];
        return {...item, like: like}
      } else {

        const likeObj = {userId:userId, name: req.body.name};
        likeData.push(likeObj)
        return {...item, like: likeData}
      }
    } else {
      return {...item}
    }
  });

  const newData = JSON.stringify(mappedDate);
  fs.writeFileSync('db/posts.json', newData);
  res.send(newData);
});

app.listen(port, () => {
  console.log(`🔋 Server is running at http://localhost:${port}`);
});


type PostData = {
  id: number;
  userId: number;
  content: string;
  date: string;
  imageUrl?: string;
  like?: {userId: number, name: string}[]
};
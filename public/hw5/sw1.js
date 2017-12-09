console.log("hi i'm service worker");

self.addEventListener("fetch", e=>{
  e.respondWith(
    new Response("yo")   
  );
});

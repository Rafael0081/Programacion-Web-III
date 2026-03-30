//antes de usar promesas, el código con callbacks se veia asi:
function obtenerComentariosDelUsuario() {
  fetchUser(1)
    .then(user => {
      fetchPosts(user.id)
        .then(posts => {
          fetchComments(posts[0].id)
            .then(comments => {
              console.log("Comentarios:", comments);
            })
            .catch(err => console.error("Error en comentarios", err));
        })
        .catch(err => console.error("Error en posts", err));
    })
    .catch(err => console.error("Error en usuario", err));
}
//con sync/await y promesas, el codigo se ve asi:
async function obtenerComentariosDelUsuario() {
  try {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    
    console.log("Comentarios:", comments);
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

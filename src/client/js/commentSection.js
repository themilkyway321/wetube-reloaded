const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment =(text)=>{
    const videoComments = document.querySelector(".video__comments");
    const newComment = document.createElement("li");
    newComment.className="video__comment";
    const icon = document.createElement("i");
    icon.className=" fas fa-comment";
    const span = document.createElement("span");
    span.innerText =` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    videoComments.prepend(newComment);
}


const handleSubmit = async(event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{
        "Content-Type":"application/json", //string형태로 보내지만 사실은 json이야 
    },
    body:JSON.stringify({text}), //string 형태로 보내기
  })
  textarea.value="";
  if(status === 201){
    addComment(text);
  }
};
if(form){
form.addEventListener("submit", handleSubmit);
}
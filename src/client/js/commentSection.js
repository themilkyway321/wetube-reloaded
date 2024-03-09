const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteIcon = document.querySelectorAll(".delete__icon");

const addComment =(text, id)=>{
  const videoComments = document.querySelector(".video__comments");

  const newComment = document.createElement("li");
  newComment.className="video__comment";
  newComment.dataset.id=id;
  const icon = document.createElement("i");
  icon.className=" fas fa-comment";


  const span = document.createElement("span");
  span.innerText =` ${text}`;

  const span2 = document.createElement("span");
  span2.className="delete__icon";
  span2.innerText="❌";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  span2.addEventListener("click", handleDelete);
}


const handleSubmit = async(event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  //fetch는 response를 return 하는데 console.log(response)해보면 status가 있다. 
  const response = await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{
        "Content-Type":"application/json", //string형태로 보내지만 사실은 json이야 
    },
    body:JSON.stringify({text}), //string 형태로 보내기
  });
  textarea.value = "";
  if(response.status === 201){

    const { newCommentId, } = await response.json();

    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const deleteComment = event.target.parentElement;

  const {
    dataset: { id },
  } = event.target.parentElement;

  const videoId = videoContainer.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId: id }),
  });

  if (response.status === 200) {
    deleteComment.remove();
  }
};
if(form){
form.addEventListener("submit", handleSubmit);
}
if (deleteIcon) {
  deleteIcon.forEach((icon) => icon.addEventListener("click", handleDelete));
}
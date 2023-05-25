"use strict";

function getCookie(name) {
  // 쿠키를 받아오는 함수
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

accessToken = getCookie("accessToken"); //accessToken

decoded = parseJwt(accessToken);

function parseJwt(accessToken) {
  //토큰을 받아서 payload를 반환하는 함수
  if (!accessToken) {
    return null;
  } else {
    const base64Url = accessToken.split(".")[1];

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    let jsonPayload;

    if (typeof window === "undefined") {
      // Node.js 환경
      jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    } else {
      // 브라우저 환경
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    }

    return JSON.parse(jsonPayload);
  }
}
//let isAdmin = false;
isAdminCheck();
// 관리자인지 판단하는 함수
function isAdminCheck() {
  if (!accessToken) {
    isAdmin = false;
    localStorage.setItem("isAdmin", isAdmin);
  } else {
    if (decoded.isAdmin === 1) {
      isAdmin = true;
      localStorage.setItem("isAdmin", isAdmin);
    } else {
      isAdmin = false;
      localStorage.setItem("isAdmin", isAdmin);
    }
  }
}
let post_mode = localStorage.getItem("post_mode");

//let post_id;
//let data;

let date = document.getElementById("date");
let writer = document.getElementById("writer");
let title = document.getElementById("title");
let details = document.getElementById("wysiwyg-editor");
let writebtn = document.getElementById("writebtn");

let createDate = new Date(); //현재 date ex) 2023-03-03 15:30:00
let year = createDate.getFullYear();
let month = createDate.getMonth() + 1;
let day = createDate.getDate();
let YearMonthDate = year + "-" + month + "-" + day; //ex) 2021-10-07

if (post_mode === "write") {
  document.querySelector("h1").textContent = "공지사항";
  date.textContent = YearMonthDate;
  writebtn.textContent = "게시";

  writebtn.addEventListener("click", function (submitevent) {
    if (title.value == "") {
      alert("제목을 입력해주세요.");
      title.focus();
      submitevent.preventDefault();
    } else if (details.value == "") {
      alert("내용을 입력해주세요.");
      details.focus();
      submitevent.preventDefault();
    } else {
      submitevent.preventDefault();

      let data = {
        title: title.value,
        details: details.value,
      };

      postData(data);
    }
  });
}

if (post_mode === "modify") {
  document.querySelector("h1").textContent = "공지사항";
  post_id = localStorage.getItem("post_id");

  data = getSelectData(post_id).then((data) => {
    title.value = data[0].TITLE;
    details.value = data[0].DETAILS;
    date.textContent = data[0].DATE;
  });
  //게시 버튼이 수정 버튼으로 바뀌고, 수정 버튼을 누르면 데이터를 수정한다.
  writebtn.textContent = "수정";
  writebtn.addEventListener("click", function (submitevent) {
    if (title.value == "") {
      alert("제목을 입력해주세요.");
      title.focus();
      submitevent.preventDefault();
    } else if (details.value == "") {
      alert("내용을 입력해주세요.");
      details.focus();
      submitevent.preventDefault();
    } else {
      submitevent.preventDefault();
      let data = {
        title: title.value,
        details: details.value,
      };
      putData(data);
    }
  });
}

async function getSelectData(post_id) {
  try {
    const url = `http://localhost:8080/notice?idx=${post_id}`;

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    //data를 리턴한다.
    data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
}

function postData(Data) {
  const url = `http://localhost:8080/notice/post`; //?type=create
  fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(Data),
  })
    .then((response) => response.json())
    .then((notice) => {
      //onbeforeunload를 막는다.
      window.onbeforeunload = null;
      localStorage.setItem("post_id", notice.insertId);
      location.href = "../../views/notic/notice.html";
    })
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
}

function putData(data) {
  const url = `http://localhost:8080/notice/post?idx=${post_id}`;
  fetch(url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("PUT request failed");
      }
    })
    .then((notice) => {
      window.onbeforeunload = null;
      location.href = "../../views/notic/notice.html";
    })
    .catch((err) => console.error(err));
}

/* window.onbeforeunload = function (event) {
  return "정말 떠나시겠습니까?";
}; */

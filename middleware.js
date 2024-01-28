import { NextResponse } from "next/server";

export default async function Middleware(req,res) {
  const curl = req.nextUrl.clone();
  const token = req.cookies.get("token");
  if (token) {
    const response = await fetch("https://chatapi.unifyxent.com/verify", {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    });

    const data = await response.json();
    if (response.status == 200 && data.msg == "Authorized") {
      //TODO if base pages then redirect to inbox page
      if (
        req.nextUrl.pathname == "/" ||
        req.nextUrl.pathname == "/login" ||
        req.nextUrl.pathname == "/register"
      ) {
        curl.pathname = "/inbox";
        return NextResponse.redirect(curl);
      }
      //TODO else redirect to next
     return NextResponse.next();
    } else {
      //TODO check if inbox page
      if (req.nextUrl.pathname == "/inbox") {
        curl.pathname = "/login";
        NextResponse.redirect(curl);
      }
      return NextResponse.next();
    }
  } else {
    //TODO check if inbox page
    if (req.nextUrl.pathname == "/inbox") {
      curl.pathname = "/login";
      return NextResponse.redirect(curl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/inbox/:path*", "/", "/login", "/register"],
};

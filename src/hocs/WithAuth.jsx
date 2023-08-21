import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function WithAuth(Component) {
  const navigate = useNavigate();
  const [isUser, setUser] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(true);
      } else {
        setUser(false);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  return isUser ? <Component /> : null;
}

export default WithAuth;

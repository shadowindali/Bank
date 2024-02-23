import React from "react";
import AppStack from "./app/main/AppStack";
import { UserProvider } from "./app/hooks/context";

export default function App() {
  return (
    <UserProvider>
      <AppStack />
    </UserProvider>
  );
}

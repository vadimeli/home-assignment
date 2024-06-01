import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { UserData } from "../../types";
import "./styles.css";
import { UserAvatar } from "../UserAvatar";
import {useEffect, useMemo, useState} from "react";
import * as React from "react";



type HeaderProps = {
  openPostEditor: () => void;
  users: UserData[]
  activeUserId: null | number;
  setActiveUserId: React.Dispatch<React.SetStateAction<number>>
};

export const Header: React.FC<HeaderProps> = ({ openPostEditor, users, activeUserId, setActiveUserId }) => {
  const localUsers = useMemo((): UserData[] => {
    return [...users];
  }, [users]);

  useEffect(() => {
    getRandomUser();
  }, [users])

  const getRandomUser = () => {
    if(localUsers.length === 0) {
      localUsers.push(...users)
    }

    const random = Math.floor(Math.random() * localUsers.length);

    if(localUsers[random]) {
      const id = localUsers[random].id
      localUsers.splice(random, 1)
      setActiveUserId(id);
    }
  }

  const user = useMemo(() => {
    return users.find(i=> i.id === activeUserId) ||  {id: 0, name: "" };
  }, [activeUserId]);


  return (
      <AppBar position="static">
        <Toolbar disableGutters className="app-toolbar">
          <Tooltip title="Switch User">
            <IconButton onClick={getRandomUser}>
              <UserAvatar user={user} className="user-avatar" />
            </IconButton>
          </Tooltip>
          <div>
            <Typography className="app-title main" variant="h6">
              BriefCam Social
            </Typography>
            <Typography className="app-title" variant="subtitle1" lineHeight={1}>
              {user.name}
            </Typography>
          </div>
          <Tooltip title="Add Post">
            <IconButton onClick={openPostEditor}>
              <AddOutlined htmlColor="white" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
  );
};

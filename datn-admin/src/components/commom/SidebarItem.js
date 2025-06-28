import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Fragment, useState } from "react";


const SidebarItem = ({ id, name, icon, path, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  if (!children) {
    return (
      <ListItemButton key={id} href={path}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    );
  }
  return (
    <Fragment key={id}>
      <ListItemButton onClick={()=>{setCollapsed(!collapsed)}}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      <Collapse in={collapsed} timeout="auto" unmountOnExit>
        {children.map((child) => (
          <ListItem key={child.id} sx={{ }}>
            <ListItemButton href={child.path}>
              <ListItemIcon>{child.icon}</ListItemIcon>
              <ListItemText primary={child.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </Collapse>
    </Fragment>
  );
};

export default SidebarItem;

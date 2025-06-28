import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography
} from "@mui/material";
import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SidebarItem = ({ id, name, icon, path, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === path;
  
  if (!children) {
    return (
      <ListItemButton 
        key={id} 
        href={path}
        sx={{
          mx: 1,
          mb: 0.5,
          borderRadius: 2,
          color: isActive ? '#1976d2' : '#666666',
          backgroundColor: isActive ? '#e3f2fd' : 'transparent',
          '&:hover': {
            backgroundColor: isActive ? '#bbdefb' : '#f5f5f5',
            color: isActive ? '#1976d2' : '#333333'
          },
          '& .MuiListItemIcon-root': {
            color: isActive ? '#1976d2' : '#666666',
            minWidth: 40
          },
          '& .MuiListItemText-primary': {
            fontWeight: isActive ? 600 : 400,
            fontSize: '0.9rem'
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    );
  }
  
  const hasActiveChild = children.some(child => location.pathname === child.path);
  
  return (
    <Fragment key={id}>
      <ListItemButton 
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          mx: 1,
          mb: 0.5,
          borderRadius: 2,
          color: hasActiveChild ? '#1976d2' : '#666666',
          backgroundColor: hasActiveChild ? '#e3f2fd' : 'transparent',
          '&:hover': {
            backgroundColor: hasActiveChild ? '#bbdefb' : '#f5f5f5',
            color: hasActiveChild ? '#1976d2' : '#333333'
          },
          '& .MuiListItemIcon-root': {
            color: hasActiveChild ? '#1976d2' : '#666666',
            minWidth: 40
          },
          '& .MuiListItemText-primary': {
            fontWeight: hasActiveChild ? 600 : 400,
            fontSize: '0.9rem'
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
        {collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={collapsed} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2 }}>
          {children.map((child) => {
            const isChildActive = location.pathname === child.path;
            return (
              <ListItem key={child.id} sx={{ px: 0 }}>
                <ListItemButton 
                  href={child.path}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    color: isChildActive ? '#1976d2' : '#666666',
                    backgroundColor: isChildActive ? '#e3f2fd' : 'transparent',
                    '&:hover': {
                      backgroundColor: isChildActive ? '#bbdefb' : '#f5f5f5',
                      color: isChildActive ? '#1976d2' : '#333333'
                    },
                    '& .MuiListItemIcon-root': {
                      color: isChildActive ? '#1976d2' : '#666666',
                      minWidth: 40
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: isChildActive ? 600 : 400,
                      fontSize: '0.85rem'
                    }
                  }}
                >
                  <ListItemIcon>{child.icon}</ListItemIcon>
                  <ListItemText primary={child.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </Box>
      </Collapse>
    </Fragment>
  );
};

export default SidebarItem;

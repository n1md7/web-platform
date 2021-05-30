import {Box, Text} from "@chakra-ui/react";
import React from "react";
import {MdAssessment, MdDashboard} from "react-icons/md";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
  return (
    <div className=" border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">FREEDOM ROW</div>
      <div className="list-group list-group-flush">
        <NavLink to="/dashboard" className="list-group-item">
          <Box d={'flex'} alignItems={'center'}>
            <MdDashboard className={'mr-1'}/>
            <Text>Dashboard</Text>
          </Box>
        </NavLink>
        <NavLink to="/assessments" className="list-group-item active">
          <Box d={'flex'} alignItems={'center'}>
            <MdAssessment className={'mr-1'}/>
            <Text>Assessments</Text>
          </Box>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
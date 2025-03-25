import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import './Layout.css';

function Layout() {
  return (
    <div className="layout-container">
      {/* 상단바 (자동 숨김 헤더) */}
      <TopNav />

      {/* 가운데 (왼쪽 + 중앙 + 오른쪽) */}
      <div className="layout-main">
        <LeftSidebar />
        <div className="layout-center">
          <Outlet />
        </div>
        <RightSidebar />
      </div>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
}

export default Layout;

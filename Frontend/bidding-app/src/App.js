import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import PrivateRoute from "./utils/PrivateRoute";
import AuctionDetail from "./components/Auctions/AuctionDetail";
import NotFound from "./components/Error404/NotFound";
import MyAuctions from "./components/Auctions/MyAuctions";
import PublicRoute from "./utils/PublicRoute";
import AdminRoute from "./utils/AdminRoute";
import VisitorRoute from "./utils/VisitorRoute";
import InactiveUser from "./components/user/InactiveUser";
import ForbiddenAction from "./components/Auctions/ForbiddenAction";
import MyMessagesHome from "./components/Messaging/MyMessagesHome";
import Footer from "./components/Footer/Footer";
import MessageDetails from "./components/Messaging/MessageDetails";
import AdminAuctions from "./components/Admin/AdminAuctions";
import AdminAuctionDetails from "./components/Admin/AdminAuctionDetails";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminUserDetails from "./components/Admin/AdminUserDetails";
import Admin from "./components/Admin/Admin";
import Register from "./components/user/Register";
import Login from "./components/user/login";
import MyAuctionDetails from "./components/Auctions/MyAuctionDetails";
import CreateAuction from "./components/Auctions/CreateAuction";
import ListAuctions from "./components/Auctions/ViewAuctions";
import Home from "./components/Home/Home";
import MyBids from "./components/Auctions/MyBids";

function App() {
	return (
		<div className="App">
			<Router>
				<Header />
				<Routes>
					<Route path="*" element={<NotFound />} />

					<Route element={<VisitorRoute />}>
						<Route path="/" element={<Home />} exact />
						<Route path="/view-auctions" element={<ListAuctions />} />
						<Route path="/view-auctions/auction/:id" element={<AuctionDetail />} />
					</Route>

					<Route element={<PrivateRoute />}>
						<Route path="/auction-creation" element={<CreateAuction />} />
						<Route path="/my-auctions/:name" element={<MyAuctions />} />
						<Route path="/my-bids/:name" element={<MyBids />} />
						<Route path="/my-auctions/:name/:id" element={<MyAuctionDetails />} />
						<Route path="/forbidden-action" element={<ForbiddenAction />} />
						<Route path="/my-messages" element={<MyMessagesHome />} />
						<Route path="/message-details/:id" element={<MessageDetails />} />
					</Route>

					<Route element={<PublicRoute />}>
						<Route path="/login" element={<Login />} />
						<Route path="/Register" element={<Register />} />
						<Route path="/inactive-user" element={<InactiveUser />} />
					</Route>

					<Route element={<AdminRoute />}>
						<Route path="/admin" element={<Admin />} />
						<Route path="/admin/auctions" element={<AdminAuctions />} />
						<Route path="/admin/auction/:id" element={<AdminAuctionDetails />} />
						<Route path="/admin/users" element={<AdminUsers />} />
						<Route path="/admin/user/:userName" element={<AdminUserDetails />} />
					</Route>
				</Routes>
			</Router>

			<Footer />
		</div>
	);
}

export default App;

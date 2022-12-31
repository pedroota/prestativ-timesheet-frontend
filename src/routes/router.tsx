import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<h1>Login Page</h1>} />
			</Routes>
		</BrowserRouter>
	);
}

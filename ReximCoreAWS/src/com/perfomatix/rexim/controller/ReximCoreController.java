package com.perfomatix.rexim.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.perfomatix.rexim.model.ScreenShot;
import com.perfomatix.rexim.model.User;
import com.perfomatix.rexim.model.UserProfile;

@Controller
public class ReximCoreController {

	@RequestMapping("/loggedin")
	public @ResponseBody
	UserProfile generateJsonResponse(HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {

		UserProfile userProfile = new UserProfile();
		userProfile = (UserProfile) session.getAttribute("userProfile");
		if (userProfile == null || userProfile.getFirstName() == "") {

			response.setStatus(HttpServletResponse.SC_FORBIDDEN);

		}
		System.out.println("Printing user profile in /loggedin --- > ");
		return userProfile;

	}

	@RequestMapping("/login")
	public @ResponseBody
	UserProfile login(@RequestBody User user, HttpServletResponse response,
			HttpSession session) {

		UserProfile userProfile = new UserProfile();
		System.out.println(user.getUserName() + "--- " + user.getPassword());
		if (!user.getUserName().equals("admin")
				|| !user.getPassword().equals("admin")) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		} else {
			userProfile.setFirstName("Atom");
			userProfile.setLastName("Splitter");
			userProfile.setRole("Admin");
			userProfile.setOrg("Super Store");
			userProfile.setOrgId("sstore");
			session.setAttribute("userProfile", userProfile);
		}

		return userProfile;
	}

	@RequestMapping("/logout")
	public void logOut(HttpSession session, HttpServletResponse response,
			HttpServletRequest request) {
		session.invalidate();
		response.setStatus(HttpServletResponse.SC_OK);
	}
	
	@RequestMapping(value="/screenShot")//,  = {"application/x-javascript", "application/json", "application/xml"})
	public @ResponseBody ScreenShot
	 screenShot(HttpSession session, HttpServletResponse response,HttpServletRequest request) {
		response.setContentType("application/x-javascript");
		System.out.println("inside callback");
		ScreenShot screenShot = new ScreenShot();
		screenShot.setSuccess("200");
		return screenShot;
	}
}

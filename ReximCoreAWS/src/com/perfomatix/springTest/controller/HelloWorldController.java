package com.perfomatix.springTest.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;

import com.perfomatix.springTest.model.User;
import com.perfomatix.springTest.model.UserProfile;

@Controller
public class HelloWorldController {
	
	@RequestMapping("/hello")
	public ModelAndView helloWorld(){
		String message = "Another hello world";
		System.out.println("logging in ---- >");
		return new ModelAndView("hello","message",message);
	}
	
	@RequestMapping("/loggedin")
    public @ResponseBody UserProfile generateJsonResponse(HttpServletRequest request, HttpServletResponse response,HttpSession session){
		
		UserProfile userProfile = new UserProfile();
		userProfile = (UserProfile) session.getAttribute("userProfile");
		if(userProfile==null || userProfile.getFirstName()==""){
			
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			
		}	
		System.out.println("Printing user profile in /loggedin --- > " );
	return userProfile;		
		
    }
	@RequestMapping("/login")
	public @ResponseBody UserProfile login(@RequestBody User user , HttpServletResponse response , HttpSession session){
		
		UserProfile userProfile = new UserProfile();
		System.out.println(user.getUserName() +"--- "+ user.getPassword());
		if(!user.getUserName().equals("admin") || !user.getPassword().equals("admin")){
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		}
		else //if(user.getUserName() == "admin" && user.getPassword() == "admin")
		{   userProfile.setFirstName("Atom");
			userProfile.setLastName("Splitter");
			userProfile.setRole("SuperAdmin");
			session.setAttribute("userProfile", userProfile);			
		}
		
		return userProfile;
	}
	@RequestMapping("/logout")
	public void logOut (HttpSession session, HttpServletResponse response , HttpServletRequest request){
		session.invalidate();
		response.setStatus(HttpServletResponse.SC_OK);
	}
}

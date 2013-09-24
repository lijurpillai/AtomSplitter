<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<% 
    String redirectURL = "/ReximCoreAWS/app/index.html"; 
    response.sendRedirect(redirectURL);
	%>	
	<a href="hello.html">Say Hello</a>
</body>
<script src="http://cdn.pubnub.com/pubnub-3.5.3.1.min.js"></script>
<script src="assets/js/presence.js"></script>
</html>
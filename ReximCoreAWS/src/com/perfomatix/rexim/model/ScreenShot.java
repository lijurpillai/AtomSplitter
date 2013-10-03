package com.perfomatix.rexim.model;

import org.codehaus.jackson.annotate.JsonIgnore;

public class ScreenShot implements JsonObject {
	
	private String success;
	@JsonIgnore
	private String jsonCallback;

	@Override
	public void setJsonCallback(final String jsonCallback) {
		this.jsonCallback = jsonCallback;		
	}
	@Override
	public String getJsonCallback() {
		return this.jsonCallback;
		
	}
	public String getSuccess() {
		return success;
	}
	public void setSuccess(String success) {
		this.success = success;
	}

}

package com.perfomatix.rexim.model;
	
public class RuleProfile {
	private String ruleId;
	private String ruleName;
	private String displayName;
	private String chat;
	private String push;
	
	public void getRules(String orgId) {
		
		
	}

	public String getRuleId() {
		return ruleId;
	}

	public void setRuleId(String ruleId) {
		this.ruleId = ruleId;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getChat() {
		return chat;
	}

	public void setChat(String chat) {
		this.chat = chat;
	}

	public String getPush() {
		return push;
	}

	public void setPush(String push) {
		this.push = push;
	}
	
}

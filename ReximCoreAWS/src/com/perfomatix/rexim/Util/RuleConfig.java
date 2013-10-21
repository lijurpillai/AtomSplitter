package com.perfomatix.rexim.Util;

import java.io.FileWriter;
import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.perfomatix.rexim.model.RuleProfile;

public class RuleConfig {

	//private static final String jsonFilePath = "\\ruleJson.json";
	public ArrayList<RuleProfile> getRule(String orgId,String path){
		JSONParser jsonParser = new JSONParser();		
		ArrayList<RuleProfile> ruleList = new ArrayList<RuleProfile>();
		try {
			long ruleLen = 0;
			FileReader fileReader = new FileReader(path);					
			JSONArray  jArray =  (JSONArray)jsonParser.parse(fileReader);			
			JSONObject jo = (JSONObject)jArray.get(0);
			ruleLen = (long)jo.get("ruleLen");			
			System.out.println("ruleLen: " + ruleLen);
			
			for (int i = 1; i <=ruleLen; i++) {
				RuleProfile ruleProfile = new RuleProfile();
				jo = (JSONObject)jArray.get(i);
				ruleProfile.setChat((String)jo.get("chat"));
				ruleProfile.setPush((String)jo.get("push"));
				ruleProfile.setRuleId((String)jo.get("ruleId"));
				ruleProfile.setRuleName((String)jo.get("ruleName"));
				ruleProfile.setDisplayName((String)jo.get("displayName"));
				ruleList.add(ruleProfile);
				System.out.println("ruleNam: " + jo.get("ruleName"));				
			}

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return ruleList;
	}	

}
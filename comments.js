<%if(jQuery.inArray(spotID,cleanUserSpotsArray) >-1){
				alert("you follow this");
				
			}
			else{

				%><form id="followSpotForm" method="post">
				    <input type="hidden" id="spot" value="<%= this.model._id %>">
				    <input type="hidden" id="user" value="<%= user %>">
				    <input type="submit" id="submitButton" data-theme="g" value="Follow spot">
				</form><%
			}
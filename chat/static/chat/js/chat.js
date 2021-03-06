$(function () {

    //Cache the container and the input for later use
    var messages = $(".latest-messages");
    var messageInput = $("#input-message");
    var tabInformation = $("#tab-information");
    var selectMetadataName;
    var apiCall = "/api/v1/";

    //This function will update the max-height of the container to adapt to different screens
    //It is done by calculating the difference between the height of the window and the HTML elements
    //outerHeight is the height of element with its margins
    function setContainerHeight() {
        var windowHeight = $(window).outerHeight();
        var navbarHeight = $(".navbar-inverse").outerHeight();
        var chatTitleHeight = $("#chat-title").outerHeight();
        var navTabsHeight = $(".nav-tabs").outerHeight();
        var messageInputHeight = messageInput.outerHeight();

        var maxHeight = windowHeight - (navbarHeight + chatTitleHeight + navTabsHeight + messageInputHeight + 50);
        messages.css("max-height", maxHeight + "px");
    }

    //If the user resizes the screen the height is updated
    $(window).on('resize', function () {
        setContainerHeight();
    });

    //Call the function once
    setContainerHeight();

    // Returns a readable string representing a Date object (includes time of day).
    function getFormattedDate(dt) {
        var d = new Date(dt);
        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();

    }

    //This function receives the title and value of a metadata,
    //creates a new panel and attaches it to the information tab
    function displayMetadataInformation(title, value) {

        var divRow;
        var lastRow = tabInformation.children(".row").last(); //Get the last row of information tab
        var childrenNumber = lastRow.children().length; //Get the number of columns of that row

        if (childrenNumber === 0 || childrenNumber === 3) { //If the row does not exist or it has 3 children
            divRow = $("<div>", {class: "row"}); //Create a new row
        } else {
            divRow = lastRow; //or use the last row
        }

        //Elements to append the metadata information
        var panelInformation = $("<div>", {class: "panel panel-default panel-information"});
        var panelHeading = $("<div>", {class: "panel-heading"});
        var panelBody = $("<div>", {class: "panel-body"});
        var divColumn = $("<div>", {class: "col-sm-4"});

        //Fill the content into the panel and add it to the row
        panelHeading.html("<strong>" + title + "</strong>");
        panelBody.html(value);
        panelInformation.append(panelHeading);
        panelInformation.append(panelBody);
        divColumn.append(panelInformation);
        divRow.append(divColumn);
        tabInformation.append(divRow);

    }

    function getMetadataInformation(chatId) {
        $.getJSON("/api/v1/ticket/" + CHAT_ID + "/")
            .success(function (data) {

                tabInformation.html("");

                var metadataObject = data;
                var dateCreated = metadataObject.created;
                var dateClosed = metadataObject.closed;
                var cost = metadataObject.cost;
                var dueDate = metadataObject.due_date;
                var notes = metadataObject.notes;
                var user = null;

                if (metadataObject.user != null) {
                    user = metadataObject.user.username;
                }

                displayMetadataInformation("Date created", getFormattedDate(dateCreated));

                if (dateClosed !== null) {
                    displayMetadataInformation("Date closed", getFormattedDate(dateClosed));
                }

                if (cost != null) {
                    displayMetadataInformation("Cost", cost);
                }

                if (dueDate != null) {
                    displayMetadataInformation("Due Date", getFormattedDate(dueDate));
                }

                if (notes != null) {
                    displayMetadataInformation("Notes", notes);
                }

                if (user != null) {
                    displayMetadataInformation("Assignee", user);
                }

            });
    }

    function addMessage(object) {

        var child = object.val();

        //Create a new date field to use in Mustache
        child.formattedDate = getFormattedDate(child.dt);

        var messagesTemplate =
            '<div class="row">' +
            '<div class="col-xs-1">' +
            '<div class="user-box pull-right">' +
            '<span class="text-muted">' +
            '<em>' +
            '{{ user }}' +
            '</em>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="col-xs-11">';

        if (CURRENT_USER == child.user) {
            messagesTemplate += '<div class="message-container triangle-right right">';
        } else {
            messagesTemplate += '<div class="message-container triangle-right left">';
        }
        messagesTemplate +=
            '<p class="lead message-text">{{ desc }}</p> ' +
            '<p class="message-date">{{ formattedDate }}</p>' +
            '</div>' +
            '</div>' +
            '</div>';

        var renderedTemplate = Mustache.to_html(messagesTemplate, child);
        messages.append(renderedTemplate);

        // On new message load, scroll to the top.
        messages[0].scrollTop = messages[0].scrollHeight;
    }

    if (typeof CHAT_ID != 'undefined' && typeof PROJECT_ID != 'undefined' &&
        typeof CURRENT_USER_ID != 'undefined') {
        // Initialise the Firebase
        var ref = new Firebase("https://teamproject3.firebaseio.com/");

        // Creating a chat object
        var projectObj = ref.child('project/' + PROJECT_ID);
        var chatObj = projectObj.child('chats/' + CHAT_ID);

        var chatParticipants = chatObj.child("participants");

        var selectUserProfile;

        chatParticipants.startAt().endAt().on("value", function (snapshot) {
            var participants = snapshot.val();
            var found = false;
            for (var key in participants) {
                if (participants.hasOwnProperty(key)) {
                    var user = participants[key];
                    if (CURRENT_USER == user) {
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                chatParticipants.push(CURRENT_USER);
            }

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        var messagesRef = chatObj.child("messages");

        //Listen for ENTER press and update Firebase
        messageInput.keypress(function (e) {
            if (e.keyCode == 13) {
                messagesRef.push({
                    desc: messageInput.val(),
                    user: CURRENT_USER,
                    user_id: CURRENT_USER_ID,
                    dt: Date.now()
                });
                messageInput.val("");
            }
        });

        messagesRef.on("child_added", function (object) {
            addMessage(object);
        });

        getMetadataInformation(CHAT_ID);

    }

    $.getJSON("/api/v1/metadata_name/")
        .success(function (metadataName) {
            var metadataObjects = metadataName.objects;
            var metadataNameListTemplate = "{{#metadataName}}<li><a id='metadata-name-{{ id }}'>{{ name }}</a></li>{{/metadataName}}";
            var renderedTemplate = Mustache.to_html(metadataNameListTemplate, {'metadataName': metadataObjects});
            $("#list-metadata-name")
                .html(renderedTemplate)
                .find("a")
                .on("click", function () {
                    $("#dropdown-metadata-name").html(this.text + ' <span class="caret"></span>');
                    selectMetadataName = this.id.split("-")[2]; //Get the id of the selected metadata name
                });
        });

    $.getJSON("/api/v1/user_profile/")
        .success(function (userProfile) {
            var userProfileObjects = userProfile.objects;
            var userProfileListTemplate = "{{#userProfile}}<li><a id='user-profile-{{ id }}'>{{ user.username }}</a></li>{{/userProfile}}";
            var renderedTemplate = Mustache.to_html(userProfileListTemplate, {'userProfile': userProfileObjects});
            $("#list-user")
                .html(renderedTemplate)
                .find("a")
                .on("click", function () {
                    $("#user-dropdown-button").html(this.text + ' <span class="caret"></span>');
                    selectUserProfile = this.id.split("-")[2]; //Get the id of the selected user profile
                });
        });

    $("#confirm-add-note").on("click", function () {

        var passData = {
            "notes": $("#note-value").val()
        };

        $.ajax({
            url: apiCall + "ticket/" + CHAT_ID + "/",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(passData),
            complete: function () {
                getMetadataInformation(CHAT_ID);
                $("#open-tab-information").tab("show");
            }
        });

    });

//Add due date
    $("#confirm-add-due-date").on("click", function () {

        var passData = {
            "due_date": $("#due-date-value").val()
        };

        $.ajax({
            url: apiCall + "ticket/" + CHAT_ID + "/",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(passData),
            complete: function () {
                getMetadataInformation(CHAT_ID);
                $("#open-tab-information").tab("show");
            }
        });

    });

    $("#confirm-add-cost").on("click", function () {

        var passData = {
            "cost": parseInt($("#cost-value").val())
        };

        $.ajax({
            url: apiCall + "ticket/" + CHAT_ID + "/",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(passData),
            complete: function () {
                getMetadataInformation(CHAT_ID);
                $("#open-tab-information").tab("show");
            }
        });

    });

    $("#confirm-add-assignee").on("click", function () {

        var passData = {
            "user": apiCall + "user/" + selectUserProfile + "/"
        };

        $.ajax({
            url: apiCall + "ticket/" + CHAT_ID + "/",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(passData),
            complete: function (data) {
                getMetadataInformation(CHAT_ID);
                $("#open-tab-information").tab("show");
            }
        });

    });
});

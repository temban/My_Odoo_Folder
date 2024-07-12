odoo.define("marketplace_seller_livechat.history", function (require) {
  "use strict";
  require("bus.BusService");

  var publicwidget = require("web.public.widget");
  // var MessageWidget = require("im_livechat.im_livechat");
  var session = require("web.session");
  var core = require("web.core");
  var Dialog = require("web.Dialog");
  var emojis = require("website.mail.emojis");
  var dom = require("web.dom");

  var QWeb = core.qweb;

  var _t = core._t;

  var no_chats_html = `
        <div class="o_thread_window outer_header set_position">
            <div class="o_thread_window_header">
                <span class="o_thread_window_title">
                <img src="/marketplace_seller_livechat/static/src/img/icon-chat.png" alt="" class="img-fluid"/>
                    <span style="color:white;">Seller Buyer Live Chat</span>
                </span>
                <span style="color: #FFFFFF;" class="o_thread_window_buttons ml-auto">
                    <i class="fa fa-times"></i>
                </span>
            </div>
        </div>
        <div class="o_thread_window o_in_home_menu" style="display:none;">
            <div class="o_thread_window_header">
                <span class="o_thread_window_title">
                <img src="/marketplace_seller_livechat/static/src/img/icon-chat.png" alt="" class="img-fluid"/>
                    <span style="color:white;">Seller Buyer Live Chat</span>
                </span>
                <span style="color: #FFFFFF;" class="o_thread_window_buttons ml-auto">
                    <i class="fa fa-times"></i>
                </span>
            </div>
            <div class="o_mail_thread">
                <div class="o_mail_thread_content channel_id">
                    <div class="public">
                        <img src="/marketplace_seller_livechat/static/src/img/login.png" class="img mr-2" alt="Login" />
                    </div>
                    <div class="text-information text-center mt-3">
                        <span>No chats available</span>
                    </div>
                    <div class="nav_btn d-flex align-items-center">
                        <a class="chat_bot_login" href="/sellers/list/?redirect=shop">Seller list</a>
                    </div>
                </div>
            </div>
        </div>
        `

  publicwidget.registry.DirectChat = publicwidget.Widget.extend({
    selector: "#wrapwrap",
    xmlDependencies: ["/marketplace_seller_livechat/static/src/xml/emojis.xml"],
    events: {
      "click #chat_now_btn": "_onClickChatNow",
      "click .chat_now_btn": "_onClickChatNowSeller",
      "click .compose_btn": "_onClickCompose",
      "click #replace_messages .go_back": "_onClickGoBack",
      "click .user-seller-content .o_chat_mini_composer .o_composer_button_emoji":
        "_onEmojiButtonClick",
      "mousedown .o_mail_emoji_container .o_mail_emoji": "_onEmojiImageClick",
      "click .user-seller-content #sellers_history .action_unfollow":
        "_onClickDelete",
      "keydown .wk_mini_composer": "_onKeydown",
      "click .user-seller-content .o_thread_window_buttons": "_closeChatWindow",
      "click .o_thread_window_header, .title": "_toggleChatWindow",
      "click #sellers_history .seller_div": "_loadSellerHistory",
      "click #sellers_history .copied_seller_div": "_loadSellerHistory",
      "click #replace_messages .reply_btn": "_onClickreplyButton",
      "click #replace_messages .close_btn": "_onClickCloseButton",
      "keyup #seller_searchbox": "_searchSellersInChat",
    },

    start: function () {
      var self = this;
      var seller_id = parseInt($("#seller-detail").data("marketplace-seller"));
      self.all_seller_id = [];
      var seller_elements = $(
        ".user-seller-content #sellers_history .seller_div,.user-seller-content #sellers_history .copied_seller_div"
      );
      seller_elements.each(function () {
        self.all_seller_id.push(parseInt($(this).data("marketplace-seller")));
      });
      // self.uuid_element = $("input[name='mail_channel_uid']");
      this.call("bus_service", "onNotification", this, this._onNotification);
      self.activate_channel = true;
      var product_id = parseInt(
        $(
          "#product_details .js_main_product .product_id[name='product_id']"
        ).val()
      );
      if (seller_id && session.user_id) {
        $.ajax({
          url: "/seller/chat/history",
          type: "GET",
          data: { seller_id: seller_id, product_id: product_id },
          beforeSend: function () {
            // svg_loader
          },
          complete: function (data) {
            var is_new_channel = $(data.responseText).find(
              ".channel_id .o_thread_message"
            ).length;
            if (is_new_channel == 0) {
              self.is_new_channel = true;
            } else {
              self.is_new_channel = false;
              $(".user-seller-content > #replace_messages").replaceWith(
                $(data.responseText)
              );
              var $el = $(".user-seller-content .outer_header");
              $el.toggleClass("set_position");
              $(".user-seller-content .o_in_home_menu").toggle();
              _.each($('.o_mail_timestamp'), function(ev){
                $(ev).html(moment.utc($(ev).html()).local().format('YYYY-MM-DD HH:mm:ss'));
              })
              $(
                ".user-seller-content #sellers_history .sellers_list .copied_seller"
              ).addClass("extra-seller");
            }
          },
        });
      }
      else if (! session.user_id){
        var res = `
                  <div class="o_thread_window outer_header set_position">
                  <div class="o_thread_window_header">
                      <span class="o_thread_window_title">
                      <img src="/marketplace_seller_livechat/static/src/img/icon-chat.png" alt="" class="img-fluid"/>
                          <span style="color:white;">Seller Buyer Live Chat</span>
                      </span>
                      <span style="color: #FFFFFF;" class="o_thread_window_buttons ml-auto">
                          <i class="fa fa-times"></i>
                      </span>
                  </div>
              </div>
              <div class="o_thread_window o_in_home_menu" style="display:none;">
                  <div class="o_thread_window_header">
                      <span class="o_thread_window_title">
                      <img src="/marketplace_seller_livechat/static/src/img/icon-chat.png" alt="" class="img-fluid"/>
                          <span style="color:white;">Seller Buyer Live Chat</span>
                      </span>
                      <span style="color: #FFFFFF;" class="o_thread_window_buttons ml-auto">
                                <i class="fa fa-times"></i>
                            </span>
                  </div>
                  <div class="o_mail_thread">
                      <div class="o_mail_thread_content channel_id">
                          <div class="public">
                              <img src="/marketplace_seller_livechat/static/src/img/login.png" class="img mr-2" alt="Login" />
                          </div>
                          <div class="text-information text-center mt-3">
                              <span>To start a conversation you need to login.</span>
                          </div>
                          <div class="nav_btn d-flex align-items-center">
                              <a class="chat_bot_login" href="/web/login?redirect=shop">Login</a>
                              <strong>/</strong>
                              <a class="chat_bot_login" href="/web/signup?redirect=shop">Signup</a>
                          </div>
                      </div>
                  </div>
              </div>
        `
        $(".user-seller-content > #replace_messages").replaceWith(
          $(res)
        );
      }
      if (session.user_id && !seller_id && $('.seller_div').length == 0){

$(".user-seller-content > #replace_messages").replaceWith(
          $(no_chats_html)
        );
      }
    },

    _onClickPreviewMarkAsRead: function (ev) {
      ev.stopPropagation();
      var $preview = $(ev.currentTarget).closest('.o_mail_preview');
      this._markAsRead($preview);
  },
    _updateCounter: function () {
      if (!this._isMessagingReady) {
          return;
      }
      var counter = this._computeCounter();
      alert(counter)
      if (this._isShown()) {
          this._updatePreviews();
      }
  },

    _computeCounter: function () {
      var channels = this.call('mail_service', 'getChannels');
      var channelUnreadCounters = _.map(channels, function (channel) {
          return channel.getUnreadCounter();
      });
      var unreadChannelCounter = _.reduce(channelUnreadCounters, function (acc, c) {
          return c > 0 ? acc + 1 : acc;
      }, 0);
      var inboxCounter = this.call('mail_service', 'getMailbox', 'inbox').getMailboxCounter();
      var mailFailureCounter = this.call('mail_service', 'getMailFailures').length;

      return unreadChannelCounter + inboxCounter + mailFailureCounter;
  },


    _onClickCloseButton: function (ev) {
      var product_card = $("#replace_messages .product_card");
      product_card.addClass("position-absolute");
      product_card.find(".close_btn").addClass("d-none");
      product_card.find(".reply_btn").removeClass("d-none");
      product_card.find(".card-title").removeClass("attach_title");
      product_card.find(".card-text").removeClass("attach_price");
      $("#replace_messages .o_mail_thread_content.channel_id").before(
        product_card
      );
    },
    _onClickreplyButton: function (ev) {
      var product_card = $("#replace_messages .product_card");
      product_card.removeClass("position-absolute");
      product_card.find(".close_btn").removeClass("d-none");
      product_card.find(".reply_btn").addClass("d-none");
      product_card.find(".card-title").addClass("attach_title");
      product_card.find(".card-text").addClass("attach_price");
      $("#replace_messages .o_chat_mini_composer").before(product_card);
    },
    _onClickGoBack: function (ev) {
      ev.stopPropagation();
      $("#sellers_history").css("z-index", 1036);
    },
    _onNotification: function (notifications) {
      var self = this;
      _.each(notifications, function (notification) {
        self._handleNotification(notification);
      });
    },
    _handleNotification: function (notification) {
      var self = this;
      if (notification[1].hasOwnProperty("id") && $.isArray(notification[0])) {
        var message_div = "";
        notification[1]['date'] = moment().format('YYYY-MM-DD H:mm:ss');
        if (
          self.all_seller_id.length != 0 &&
          notification[1].hasOwnProperty("author_id") &&
          self.all_seller_id.indexOf(notification[1].author_id[0]) != -1
        ) {
          message_div = $(
            QWeb.render("marketpalce_seller_live_chat.messages", {
              message: notification[1],
              class: "left-message",
            })
          );
          var content = _t("Message from ") + notification[1].author_id[1];
          self.displayNotification(
            {
              title: _t("New Message"),
              message: content,
              type: "info",
              sticky: false,
            },
            2000
          );
        } else {
          message_div = $(
            QWeb.render("marketpalce_seller_live_chat.messages", {
              message: notification[1],
              class: "right-message",
            })
          );
        }
        var chatwindow = $(
          ".user-seller-content #replace_messages .o_thread_window.o_in_home_menu"
        );
        if (
          chatwindow.length != 0 &&
          notification[1].hasOwnProperty("channel_ids") &&
          notification[1].channel_ids.indexOf(
            parseInt(chatwindow.data("thread-id"))
          ) != -1
        ) {
          if (
            $(".user-seller-content .channel_id > div:last-child").length == 0
          ) {
            $(".user-seller-content .channel_id").prepend(message_div);
          } else {
            $(".user-seller-content .channel_id > div:last-child").after(
              message_div
            );
          }
        }
        self._scrollBottom();
      }
    },

    getSelectionPositions: function () {
      var InputElement = this.$input.get(0);
      return InputElement
        ? dom.getSelectionRange(InputElement)
        : { start: 0, end: 0 };
    },
    _onEmojiImageClick: function (ev) {
      ev.preventDefault();
      this.$input = $(".user-seller-content .wk_mini_composer");
      var cursorPosition = this.getSelectionPositions();
      var inputVal = this.$input.val();
      var leftSubstring = inputVal.substring(0, cursorPosition.start);
      var rightSubstring = inputVal.substring(cursorPosition.end);
      var newInputVal = [
        leftSubstring,
        $(ev.currentTarget).data("emoji"),
        rightSubstring,
      ].join(" ");
      var newCursorPosition = newInputVal.length - rightSubstring.length;
      this.$input.val(newInputVal);
      this.$input.focus();
      this.$input[0].setSelectionRange(newCursorPosition, newCursorPosition);
      this._hideEmojis();
    },
    _onEmojiButtonClick: function () {
      if (!this._$emojisContainer) {
        // lazy rendering
        this._$emojisContainer = $(
          QWeb.render("marketpalce_seller_live_chat.emojis", {
            emojis: emojis,
          })
        );
      }
      if (this._$emojisContainer.parent().length) {
        this._hideEmojis();
      } else {
        this._$emojisContainer.appendTo(this.$(".o_chat_mini_composer"));
      }
    },
    _hideEmojis: function () {
      this._$emojisContainer.remove();
    },
    _onClickDelete: function (ev) {
      ev.stopPropagation();
      var $el = $(ev.currentTarget).closest(".seller_div");
      if ($el.length == 0) {
        $el = $(ev.currentTarget).closest(".copied_seller_div");
      }
      var channel_id = parseInt($el.data("channel-id"));

      Dialog.confirm(this, _t("Are you sure you want to remove this chat?"), {
        confirm_callback: function () {
          session
            .rpc("/seller/remove/channel", {
              channel_id: channel_id,
            })
            .then(function (result) {
              var seller_id = parseInt(
                $("#seller-detail").data("marketplace-seller")
              );
              if (seller_id == parseInt($el.data("marketplace-seller"))) {
                window.location.reload();
              }
              $el.addClass("d-none");
              $(".user-seller-content .channel_id .o_thread_message").addClass(
                "d-none"
              );
              $(".user-seller-content .o_chat_mini_composer").addClass(
                "d-none"
              );
              $(
                ".user-seller-content .o_thread_window .o_thread_window_header .o_thread_window_title"
              ).text(_t("Click on sellers to see chats"));
              var res = $('.seller_div').filter((i,e) => {
                return !$(e).hasClass('d-none');
              })
              if (res.length == 0) {
                window.location.reload();
              }
            });
        },
      });
    },
    _loadSellerHistory: function (ev) {
      ev.preventDefault();
      var seller_id = parseInt($(ev.currentTarget).data("marketplace-seller"));
      $(
        ".user-seller-content #sellers_history .seller_div.active,.user-seller-content #sellers_history .copied_seller_div.active"
      ).removeClass("active");

      $(ev.currentTarget).addClass("active");
      $(".user-seller-content > #replace_messages .o_mail_thread").empty();

      this.is_new_channel = true;
      $("#sellers_history").css("z-index", 1034);
      this._onClickChatNow(ev,seller_id);
    },
    _toggleChatWindow: function (ev) {
      var $el = $(".user-seller-content .outer_header");
      $el.toggleClass("set_position");
      $(".user-seller-content #sellers_history").toggle();
      $(".user-seller-content .o_in_home_menu").toggle(
        // function () {
        //   $(this).animate({ height: 20 }, 200);
        // },
        // function () {
        //   $(this).animate({ height: 400 }, 200);
        // }
      );
      this._scrollBottom();
    },

    _closeChatWindow: function (ev) {
      ev.stopPropagation();
      $(".user-seller-content").css("display", "none");
    },
    _scrollBottom: function () {
      var $el = $(".user-seller-content .o_mail_thread");
      if ($el.length != 0) {
        $el.scrollTop($el[0].scrollHeight);
      }
      this._messagePopover();
    },
    _messagePopover: function () {
      $("#replace_messages .o_mail_thread").scroll(function (ev) {
        var element = ev.target;
        if (
          element.scrollTop == 0 ||
          $("#replace_messages .reply_btn").hasClass("d-none") == true
        ) {
          $("#replace_messages .product_card").removeClass("position-absolute");
        } else {
          $("#replace_messages .product_card").addClass("position-absolute");
        }
      });
    },
    _onKeydown: function (ev) {
      ev.stopPropagation(); // to prevent jquery's blockUI to cancel event
      // ENTER key (avoid requiring jquery ui for external livechat)
      if (ev.which === 13) {
        this._onClickCompose(ev);
      }
    },
    _onClickCompose: function (ev) {
      ev.preventDefault();
      var composer = $(".wk_mini_composer");
      var channel_id = parseInt(
        $(".wk_mini_composer")
          .closest(".o_thread_window")
          .find(".channel_id")
          .data("channel-id")
      );
      var message;
      var product_title = $("#replace_messages .attach_title");
      var product_price = $("#replace_messages .attach_price");
      if (product_title.length != 0 && product_price.length != 0) {
        var product_detail = product_title.text() + product_price.text();
        message = product_detail;
      }
      if (message == undefined) {
        message = composer.val();
      } else {
        message += "\n" + composer.val();
      }
      var uuid = $("input[name='mail_channel_uid']").val();
      if (channel_id && message && uuid) {
        return session
          .rpc("/mail/chat_post", {
            uuid: uuid,
            message_content: message,
          })
          .then(function () {
            $('a.seller_div.active').click()
            composer.val("");
          });
      }
    },
    _onClickChatNow: function (ev,seller=false,create_channel=false) {
      var $elem = $(ev.currentTarget);
      ev.preventDefault();
      var self = this;
      $(".user-seller-content").css("display", "block");
      var seller_id = seller;
      var product_id = parseInt(
        $(
          "#product_details .js_main_product .product_id[name='product_id']"
        ).val()
      );
      if (self.is_new_channel && (create_channel || seller_id)) {
        $.ajax({
          url: "/seller/create/channel",
          type: "GET",
          data: { seller_id: seller_id, product_id: product_id },
          beforeSend: function () {
            // svg_loader
          },
          complete: function (data) {
            $(".user-seller-content > #replace_messages").replaceWith(
              $(data.responseText)
            );
            _.each($('.o_mail_timestamp'), function(ev){
              $(ev).html(moment.utc($(ev).html()).local().format('YYYY-MM-DD HH:mm:ss'));
            })
            self.is_new_channel = false;
            var channel_id = parseInt(
              $(data.responseText).find(".channel_id").data("channel-id")
            );
            var seller_element = $(
              ".user-seller-content #sellers_history .sellers_list .copied_seller"
            );
            seller_element.attr("data-channel-id", channel_id);
            seller_element.removeClass("d-none");
            $(".user-seller-content #sellers_history").show();
            $(".user-seller-content .o_in_home_menu").show(
            );
            self._scrollBottom();
            var def = new Promise(function (resolve, reject) {
              self.uuid_element = $("input[name='mail_channel_uid']");
              resolve(self.uuid_element);
            });
            def.then(function () {
              self._callBusservice();
            });
          },
        });
      } else {
        self._callBusservice();
      }
      self._scrollBottom();
    },

    _onClickChatNowSeller:function(ev){
      var seller_id = parseInt($(ev.currentTarget).data("marketplace-seller"));

      if (seller_id){
        $('#chat_now_btn').trigger('click',[seller_id,true]);
        $('.o_thread_window_header, .title').trigger('click');

      }
    },
    _callBusservice: function () {
      var self = this;
      var uuid_element;
      if (this.uuid_element == undefined) {
        uuid_element = $("input[name='mail_channel_uid']");
      } else {
        uuid_element = this.uuid_element;
      }
      if (this.activate_channel && uuid_element.length != 0) {
        self.call("bus_service", "addChannel", uuid_element.val());
        self.activate_channel = false;
      }
    },
    _searchSellersInChat: function (ev){
      var $input = $(ev.currentTarget);
      var searchString = $input.val().toLowerCase();
      if(searchString == ""){
        $('.sellers_list a').show();
      } else {
        $('.sellers_list a').each(function(i,item){
            var listOfSellersItem = $(item).text().toLowerCase();
            if(listOfSellersItem.indexOf(searchString) >= 0) {
              $(item).show()
            }
            else{
              $(item).hide();
            }
        });
      };
    },
  });
});

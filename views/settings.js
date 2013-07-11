surfSpoter.SettingsView = Backbone.View.extend({

    template:_.template($('#settings').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});
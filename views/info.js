surfSpoter.InfoView = Backbone.View.extend({

    template:_.template($('#info').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});
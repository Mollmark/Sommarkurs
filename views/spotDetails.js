surfSpoter.SpotDetailsView = Backbone.View.extend({

    template:_.template($('#test').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});
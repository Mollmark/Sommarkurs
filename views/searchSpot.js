surfSpoter.searchSpot = Backbone.View.extend({

	render:function () {
	
        this.$el.append(this.template(this.model));
        return this;
    }
});
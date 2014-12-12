<?php

class Message extends \Eloquent {
	protected $fillable = [];

	public function room() {
		return $this->belongsTo('Room');
	}
}

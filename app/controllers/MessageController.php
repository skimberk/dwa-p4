<?php

class MessageController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		// header('Content-Type: text/event-stream');
		// header('Cache-Control: no-cache');
		// header('Connection: keep-alive');

		// $redis = Redis::connection();

		// while(true) {
		// 	echo 'Hey!';
		// 	$redis->publish('messages', 'test');

		// 	ob_flush();
		// 	flush();

		// 	sleep(1);
		// }
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$messageText = Input::get('message');

		if($messageText) {
			// $room = new Room;
			// $room->name = "Test room";
			// $room->save();

			$message = new Message;
			$message->text = $messageText;
			$message->room_id = 1;
			$message->save();

			$redis = Redis::connection();
			$redis->publish('messages', $message->id);
		}
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$message = Message::find($id);

		return $message->toJson();
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}

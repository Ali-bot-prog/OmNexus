import bcrypt

salt = bcrypt.gensalt()
p_bytes = b"admin123"
h_bytes = bcrypt.hashpw(p_bytes, salt)

# Let's ensure verify_password logic from main.py works
print("Hash stored:", h_bytes.decode('utf-8'))
print("Verify check:", bcrypt.checkpw(p_bytes, h_bytes))
